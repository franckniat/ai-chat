import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {
    streamText,
    convertToModelMessages,
    generateText,
    type UIMessage,
} from "ai";
import { createDbChat, saveMessage, titlePrompt, updateChatTitle } from "@/lib/chat-store";
import type { Message } from "@/generated/prisma/client";
import { getMessagesByChatId } from "@/data/message";
import { getPersonalityById } from "@/lib/personalities";
import { FREE_MODEL_IDS } from "@/lib/free-models";

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60;

const reasoningModelIds = new Set<string>([
    "liquid/lfm-2.5-1.2b-thinking:free",
]);

const modelConfigs: Record<string, { model: ReturnType<typeof openrouter.chat>; isReasoning: boolean }> =
    Object.fromEntries(
        FREE_MODEL_IDS.map((modelId) => [
            modelId,
            {
                model: openrouter.chat(modelId),
                isReasoning: reasoningModelIds.has(modelId),
            },
        ])
    );

type ModelId = string;

const DEFAULT_MODEL: ModelId = FREE_MODEL_IDS[0];
const TITLE_MODEL = "openai/gpt-4o-mini";

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
    const selectedModelId = modelId as ModelId;
    const modelConfig = modelConfigs[selectedModelId] || modelConfigs[DEFAULT_MODEL];

    // Récupérer la personnalité
    const selectedPersonality = getPersonalityById(personality);

    const result = streamText({
        model: modelConfig.model,
        messages: contextMessages,
        system: `${selectedPersonality.systemPrompt}
Current date: ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        temperature: 0.7,
        onFinish: async ({ text }) => {
            console.log("onFinish called - chatId:", currentChatId, "isNewChat:", isNewChat);

            try {
                // Save the AI response
                await saveMessage(currentChatId!, "assistant", text);
                console.log("Assistant message saved");

                // Generate title if it's a new chat
                if (isNewChat && currentChatId && userMessage) {
                    console.log("Generating title for new chat:", currentChatId);

                    try {
                        const titleResult = await generateText({
                            model: openrouter.chat(TITLE_MODEL),
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
