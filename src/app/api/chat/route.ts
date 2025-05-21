import { streamText, smoothStream } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";

const client = createOpenAI({
    apiKey: token,
    baseURL: endpoint,
});

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    const model = client("openai/gpt-4.1");
    const result = streamText({
        model,
        messages,
        system: "Your name is niato ai and you are a helpful assistant. Always be kind and helpful.",
        experimental_transform: smoothStream(),
        temperature: 1,
    });

    return result.toDataStreamResponse();
}
