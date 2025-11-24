import { streamText, smoothStream } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { saveMessage } from "@/lib/chat-store";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";

const client = createOpenAI({
    apiKey: token,
    baseURL: endpoint,
});

export const maxDuration = 30;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { messages } = await req.json();
        await saveMessage(id, "user", messages[messages.length - 1].content.toString());
        const model = client("openai/gpt-4.1");
        const result = streamText({
            model,
            messages,
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
