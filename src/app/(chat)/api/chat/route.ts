import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
    streamText,
    convertToModelMessages,
    generateText,
    type UIMessage,
} from "ai";
import { createDbChat, saveMessage, titlePrompt, updateChatTitle } from "@/lib/chat-store";
import type { Message } from "@/generated/prisma/client";
import { getMessagesByChatId } from "@/data/message";
import { assertChatOwnership } from "@/lib/authz";
import { getPersonalityById } from "@/lib/personalities";
import { DEFAULT_MODEL_ID, GOOGLE_MODELS, TITLE_MODEL_ID } from "@/lib/google-models";

/**
 * Fournisseur Google direct, en remplacement d'OpenRouter.
 *
 * OpenRouter melangeait modeles gratuits et factures derriere une meme cle.
 * Le catalogue est desormais restreint aux modeles Gemini les plus economes
 * (voir lib/google-models.ts), et un identifiant inconnu retombe sur le
 * defaut, qui est le moins cher de la liste.
 */
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 60;

/**
 * Budget de contexte renvoye au modele a chaque tour.
 *
 * Compter les messages etait trop grossier : vingt repliques courtes ne
 * coutent presque rien, alors que vingt longs extraits de code coutent cher.
 * On raisonne donc en caracteres — environ quatre par token — ce qui laisse
 * une conversation normale intacte tout en bornant les fils tres lourds.
 *
 * ~48 000 caracteres ≈ 12 000 tokens de contexte : large pour du chat, loin
 * des fenetres a 1 M tokens que le modele accepterait et facturerait.
 */
const CONTEXT_CHAR_BUDGET = 48_000;
/** Garde-fou sur le nombre de repliques, pour les fils faits de una-lignes. */
const CONTEXT_MESSAGE_LIMIT = 60;

/**
 * Garde les messages les plus recents tenant dans le budget.
 *
 * On remonte du plus recent vers le plus ancien et on s'arrete des qu'un
 * message ferait deborder : l'echange courant est ainsi toujours complet.
 */
function selectContextMessages(history: Message[]): Message[] {
    const selected: Message[] = [];
    let budget = CONTEXT_CHAR_BUDGET;

    for (let i = history.length - 1; i >= 0; i -= 1) {
        const message = history[i];
        const cost = message.content.length;

        if (selected.length >= CONTEXT_MESSAGE_LIMIT) break;
        // Toujours inclure le message le plus recent, meme s'il excede a lui
        // seul le budget : l'amputer donnerait une reponse hors sujet.
        if (cost > budget && selected.length > 0) break;

        selected.push(message);
        budget -= cost;
    }

    return selected.reverse();
}

const modelConfigs = Object.fromEntries(
    GOOGLE_MODELS.map((model) => [
        model.id,
        {
            model: google(model.id),
            isReasoning: model.isReasoning,
            /**
             * Budget de reflexion, quand le modele accepte le parametre.
             *
             * Mesure sur gemini-3.8-flash : une question de trois phrases
             * produit 584 tokens de « thoughts » pour 103 tokens de reponse,
             * soit 700 au total contre 104 sans reflexion. Ces tokens sont
             * factures au tarif de sortie, d'ou un budget a zero partout sauf
             * sur le seul modele qui l'expose explicitement.
             *
             * `includeThoughts` conditionne l'emission des « thoughts » : sans
             * lui, le modele reflechit et facture mais n'envoie rien, donc le
             * panneau de raisonnement reste vide.
             */
            providerOptions:
                model.thinkingBudget === undefined
                    ? undefined
                    : {
                          google: {
                              thinkingConfig: {
                                  thinkingBudget: model.thinkingBudget,
                                  includeThoughts: model.thinkingBudget !== 0,
                              },
                          },
                      },
        },
    ])
);

const DEFAULT_MODEL = DEFAULT_MODEL_ID;

/**
 * Types acceptes en piece jointe.
 *
 * Gemini traite nativement les images et les PDF. Tout le reste est ignore
 * plutot que transmis : envoyer un binaire inconnu coute des tokens pour une
 * reponse inutilisable.
 */
const SUPPORTED_ATTACHMENT_TYPES = /^(image\/(png|jpeg|webp|heic|heif)|application\/pdf)$/;

/**
 * Plafond par piece jointe, en caracteres de data URL.
 *
 * Une data URL est environ 4/3 de la taille du fichier : ~13 Mo de texte
 * correspondent a un fichier d'environ 10 Mo. Au-dela, la requete devient
 * lente et chere pour un usage de chat.
 */
const MAX_ATTACHMENT_CHARS = 13_000_000;

type Attachment = { mediaType: string; data: string; filename?: string };

/**
 * Extrait la charge base64 d'une data URL.
 *
 * Le SDK traite une chaine `data:...` comme une URL a telecharger et leve
 * « URL scheme must be http or https » : il attend le base64 nu.
 */
function toBase64Payload(url: string): string | null {
    const comma = url.indexOf(",");
    if (!url.startsWith("data:") || comma === -1) return null;
    return url.slice(comma + 1) || null;
}

function extractAttachments(message: UIMessage): Attachment[] {
    if (!Array.isArray(message.parts)) return [];

    return message.parts.flatMap((part) => {
        if (part.type !== 'file') return [];
        if (!part.mediaType || !SUPPORTED_ATTACHMENT_TYPES.test(part.mediaType)) return [];
        if (!part.url || part.url.length > MAX_ATTACHMENT_CHARS) return [];

        const data = toBase64Payload(part.url);
        if (!data) return [];

        return [{ mediaType: part.mediaType, data, filename: part.filename }];
    });
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const {
        messages,
        chatId: receivedChatId,
        modelId = DEFAULT_MODEL,
        personality = "default",
    }: {
        messages: UIMessage[];
        chatId: string | null;
        modelId?: string;
        personality?: string;
    } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response("Missing messages", { status: 400 });
    }

    // Récupérer le dernier message utilisateur
    const lastMessage = messages[messages.length - 1];
    let userMessage = '';
    if (Array.isArray(lastMessage.parts)) {
        const textPart = lastMessage.parts.find((p) => p.type === 'text');
        if (textPart && textPart.type === 'text') {
            userMessage = textPart.text || '';
        }
    }

    // Pièces jointes du tour courant.
    //
    // Le composeur les envoyait deja, mais la route ne lisait que les parts
    // `text` : les fichiers etaient silencieusement jetes. Ils sont convertis
    // en data URL cote client (voir prompt-input.tsx), donc directement
    // transmissibles au modele.
    const attachments = extractAttachments(lastMessage);

    let currentChatId = receivedChatId;
    let isNewChat = false;
    let dbMessages: Message[] = [];

    if (!currentChatId) {
        // Créer un nouveau chat avec un titre temporaire
        isNewChat = true;
        currentChatId = await createDbChat(session.user.id, "Nouvelle conversation");
    } else {
        // Le chatId vient du client : sans cette vérification, n'importe quel
        // compte authentifié pourrait lire et écrire dans la conversation d'un autre.
        const ownsChat = await assertChatOwnership(currentChatId, session.user.id);
        if (!ownsChat) {
            return new Response("Not found", { status: 404 });
        }

        // Récupérer les messages existants pour le contexte
        dbMessages = await getMessagesByChatId(currentChatId);
    }

    // Sauvegarder le message de l'utilisateur. Les pieces jointes laissent une
    // trace lisible : la colonne `content` est une chaine, y ecrire des data
    // URL ferait exploser la base.
    const attachmentNote = attachments.length > 0
        ? attachments.map((file) => `[attachment: ${file.filename ?? file.mediaType}]`).join(" ")
        : "";
    await saveMessage(
        currentChatId,
        "user",
        [userMessage, attachmentNote].filter(Boolean).join("\n\n"),
    );

    // Préparer les messages pour le modèle.
    //
    // Fenêtre glissante : sans elle, toute la conversation était renvoyée à
    // chaque tour, donc le coût d'un fil croissait de façon quadratique — au
    // 40e message on repayait les 39 précédents.
    const windowed = selectContextMessages(dbMessages);

    // Le tour courant porte le texte et, le cas echeant, les fichiers. Les
    // tours passes restent du texte : la colonne `content` est une chaine, les
    // pieces jointes ne sont donc pas rejouees (voir la note de commit).
    const currentTurn = attachments.length > 0
        ? {
            role: 'user' as const,
            content: [
                ...(userMessage ? [{ type: 'text' as const, text: userMessage }] : []),
                ...attachments.map((file) => ({
                    type: 'file' as const,
                    data: file.data,
                    mediaType: file.mediaType,
                })),
            ],
        }
        : { role: 'user' as const, content: userMessage };

    const contextMessages = windowed.length > 0
        ? [
            ...windowed.map(msg => ({
                role: msg.role as 'user' | 'assistant' | 'system',
                content: msg.content
            })),
            currentTurn,
        ]
        : await convertToModelMessages(messages);

    // Sélectionner le modèle
    const modelConfig = modelConfigs[modelId] ?? modelConfigs[DEFAULT_MODEL];

    // Récupérer la personnalité
    const selectedPersonality = getPersonalityById(personality);

    const result = streamText({
        model: modelConfig.model,
        messages: contextMessages,
        system: `${selectedPersonality.systemPrompt}
Current date: ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        temperature: 0.7,
        providerOptions: modelConfig.providerOptions,
        onFinish: async ({ text }) => {
            try {
                // Save the AI response
                await saveMessage(currentChatId!, "assistant", text);

                // Generate title if it's a new chat
                if (isNewChat && currentChatId && userMessage) {
                    try {
                        const titleResult = await generateText({
                            // Un titre tient en quelques mots : borner la
                            // sortie evite de payer une phrase entiere, et
                            // `updateChatTitle` tronque de toute facon a 80.
                            model: google(TITLE_MODEL_ID),
                            system: titlePrompt,
                            prompt: userMessage.substring(0, 500),
                            maxOutputTokens: 32,
                            temperature: 0.3,
                        });

                        const chatTitle = titleResult.text.trim().replace(/^["']|["']$/g, '').slice(0, 80);

                        if (chatTitle && chatTitle.length > 0) {
                            await updateChatTitle(currentChatId, chatTitle);
                        }
                    } catch (titleError) {
                        console.error("Error generating title:", titleError);
                    }
                }
            } catch (error) {
                console.error("Error in onFinish:", error);
            }
        },
    });

    // Consommer le stream pour garantir onFinish même si le client se déconnecte
    result.consumeStream();

    return result.toUIMessageStreamResponse({
        sendReasoning: modelConfig.isReasoning,
        sendSources: true,
        messageMetadata: ({ part }) => {
            if (part.type === 'start') {
                return {
                    chatId: currentChatId,
                    isNewChat: isNewChat,
                };
            }
            if (part.type === 'finish') {
                return {
                    chatId: currentChatId,
                    isComplete: true,
                };
            }
        },
    });
}
