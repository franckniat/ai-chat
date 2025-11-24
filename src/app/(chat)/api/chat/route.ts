import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, createUIMessageStream, createUIMessageStreamResponse, generateId } from "ai";
import { createDbChat, saveMessage, updateChatTitle } from "@/lib/chat-store";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";

const client = createOpenAI({
    apiKey: token,
    baseURL: endpoint,
});

export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const messages = body.messages;
    let chatId = body.chatId;

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

    let isNewChat = false;

    if (!chatId) {
        isNewChat = true;
        chatId = await createDbChat(session.user.id, "Nouvelle conversation");
    }

    await saveMessage(chatId, "user", userMessage);

    const model = client("openai/gpt-4.1");

    const stream = createUIMessageStream({
        execute: ({ writer }) => {
            if (isNewChat) {
                writer.write({
                    type: 'data-message',
                    id: generateId(),
                    data: { chatId }
                });
            }

            const result = streamText({
                model,
                messages,
                system: "Your name is niato ai and you are a helpful assistant. Always be kind and helpful.",
                temperature: 1,
                onFinish: async ({ text }) => {
                    await saveMessage(chatId, "assistant", text);

                    if (isNewChat) {
                        const titleResult = streamText({
                            model,
                            messages: [{ role: "user", content: userMessage }],
                            system: "Generate a short, concise title (maximum 6 words) for this chat conversation based on the user's message. Only return the title, nothing else.",
                        });

                        let chatTitle = "";
                        for await (const chunk of titleResult.textStream) {
                            chatTitle += chunk;
                        }

                        await updateChatTitle(chatId, chatTitle);
                    }
                },
            });

            writer.merge(result.toUIMessageStream());
        },
    });

    return createUIMessageStreamResponse({ stream });
}
