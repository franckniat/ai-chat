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
import { DEFAULT_MODEL_ID, getModelById, GOOGLE_MODELS } from "@/lib/google-models";

/**
 * Fournisseur Google direct, en remplacement d'OpenRouter.
 *
 * OpenRouter melangeait modeles gratuits et factures derriere une meme cle :
 * une selection erronee pouvait consommer du credit. Ici le catalogue est
 * restreint aux modeles du palier gratuit de l'API Gemini (voir
 * lib/google-models.ts), et un identifiant inconnu retombe sur le defaut.
 */
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 60;

const modelConfigs = Object.fromEntries(
    GOOGLE_MODELS.map((model) => [
        model.id,
        {
            model: google(model.id),
            isReasoning: model.isReasoning,
            // `includeThoughts` demande a Gemini d'emettre sa chaine de
            // raisonnement ; sans cela `sendReasoning` n'aurait rien a afficher.
            providerOptions: model.isReasoning
                ? { google: { thinkingConfig: { includeThoughts: true } } }
                : undefined,
        },
    ])
);

const DEFAULT_MODEL = DEFAULT_MODEL_ID;
// Modele le plus leger du catalogue : generer un titre ne merite pas mieux.
const TITLE_MODEL = GOOGLE_MODELS[GOOGLE_MODELS.length - 1].id;

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

    // Préparer les messages pour le modèle
    const contextMessages = dbMessages.length > 0
        ? [
            ...dbMessages.map(msg => ({
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
                console.log("Assistant message saved");

                // Generate title if it's a new chat
                if (isNewChat && currentChatId && userMessage) {
                    console.log("Generating title for new chat:", currentChatId);

                    try {
                        const titleResult = await generateText({
                            model: google(TITLE_MODEL),
                            system: titlePrompt,
                            prompt: userMessage.substring(0, 500),
                        });

                        const chatTitle = titleResult.text.trim().replace(/^["']|["']$/g, '').slice(0, 80);
                        console.log("Generated title:", chatTitle);

                        if (chatTitle && chatTitle.length > 0) {
                            await updateChatTitle(currentChatId, chatTitle);
                            console.log("Title updated successfully");
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
