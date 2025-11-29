import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, createUIMessageStream, createUIMessageStreamResponse, generateId } from "ai";
import { createDbChat, saveMessage, titlePrompt, updateChatTitle } from "@/lib/chat-store";
import type { Message } from "@niato-ai/prisma-client";
import { getMessagesByChatId } from "@/data/message";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages, chatId: receivedChatId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response("Missing messages", { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    // En v5, les messages ont une structure parts (array)
    let userMessage = '';
    if (Array.isArray(lastMessage.parts)) {
        const textPart = lastMessage.parts.find((p: { type: string; text?: string }) => p.type === 'text');
        userMessage = textPart?.text || '';
    } else if (typeof lastMessage.content === 'string') {
        // Fallback pour compatibilité
        userMessage = lastMessage.content;
    }

    let currentChatId = receivedChatId;
    let isNewChat = false;
    let dbMessages: Message[] = [];

    if (!currentChatId) {
        // Créer un nouveau chat avec un titre générique
        isNewChat = true;
        currentChatId = await createDbChat(session.user.id, "Nouvelle conversation");
    } else {
        // Récupérer les messages existants pour le contexte
        dbMessages = await getMessagesByChatId(currentChatId);
    }

    // Sauvegarder le message de l'utilisateur
    await saveMessage(currentChatId, "user", userMessage);

    const model = google('gemini-2.5-pro');

    const stream = createUIMessageStream({
        execute: ({ writer }) => {
            if (isNewChat) {
                writer.write({
                    type: 'data-message',
                    id: generateId(),
                    data: { chatId: currentChatId }
                });
            }

            const result = streamText({
                model,
                messages: dbMessages.length > 0
                    ? [
                        ...dbMessages.map(msg => ({
                            role: msg.role as 'user' | 'assistant' | 'system',
                            content: msg.content
                        })),
                        { role: 'user' as const, content: userMessage }
                    ]
                    : [{ role: 'user' as const, content: userMessage }],
                system: "Your name is niato ai and you are a helpful assistant. Always be kind and helpful.",
                temperature: 1,
                //maxOutputTokens: 1000, // Limite de tokens pour la réponse (environ 750 mots)
                onFinish: async ({ text }) => {
                    await saveMessage(currentChatId, "assistant", text);

                    if (isNewChat) {
                        // Générer et mettre à jour le titre en arrière-plan
                        const titleResult = streamText({
                            model,
                            messages: [{ role: "user", content: userMessage }],
                            system: titlePrompt,
                        });

                        let chatTitle = "";
                        for await (const chunk of titleResult.textStream) {
                            chatTitle += chunk;
                        }

                        await updateChatTitle(currentChatId, chatTitle.trim());
                    }
                },
            });

            writer.merge(result.toUIMessageStream({sendSources: true, sendReasoning: true,}));
        },
    });

    return createUIMessageStreamResponse({ stream });
}
