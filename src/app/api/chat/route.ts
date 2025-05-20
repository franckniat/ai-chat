import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";

const client = createOpenAI({
    apiKey: token,
    baseURL: endpoint,
});

export async function POST(req: Request) {
    const { messages } = await req.json();
    const model = client("openai/gpt-4.1");
    const result = streamText({
        model,
        messages,
    });

    return result.toDataStreamResponse();
}
