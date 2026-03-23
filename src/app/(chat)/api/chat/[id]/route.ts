import { streamText, smoothStream, convertToModelMessages } from "ai";
import { saveMessage } from "@/lib/chat-store";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const model = openrouter('deepseek/deepseek-chat-v3-0324:free');

export const maxDuration = 30;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { messages } = await req.json();
        await saveMessage(id, "user", messages[messages.length - 1].content.toString());
        const modelMessages = await convertToModelMessages(messages);
        const result = streamText({
            model: openrouter.chat('deepseek/deepseek-chat'),
            messages: modelMessages,
            system: "Your name is niato ai and you are a helpful assistant. Always be kind and helpful.",
            experimental_transform: smoothStream(),
            temperature: 1,
            onFinish: async (completion) => {
                await saveMessage(id, "assistant", completion.text);
            }
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Error processing chat:", error);
        return new Response("Error processing chat", { status: 500 });
    }
}
