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
 * Nombre de messages passes renvoyes au modele a chaque tour.
 *
 * 20 couvre une dizaine d'echanges, largement assez pour la continuite d'une
 * conversation, tout en bornant le cout d'un fil long.
 */
const CONTEXT_MESSAGE_LIMIT = 20;

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

    // Sauvegarder le message de l'utilisateur
    await saveMessage(currentChatId, "user", userMessage);

    // Préparer les messages pour le modèle.
    //
    // Fenêtre glissante : sans elle, toute la conversation était renvoyée à
    // chaque tour, donc le coût d'un fil croissait de façon quadratique — au
    // 40e message on repayait les 39 précédents. On garde les derniers
    // échanges, suffisants pour la continuité d'un chat.
    const windowed = dbMessages.slice(-CONTEXT_MESSAGE_LIMIT);
    const contextMessages = windowed.length > 0
        ? [
            ...windowed.map(msg => ({
                role: msg.role as 'user' | 'assistant' | 'system',
                content: msg.content
            })),
            { role: 'user' as const, content: userMessage }
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
