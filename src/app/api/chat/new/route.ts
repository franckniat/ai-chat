import { streamText, smoothStream, generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";

const client = createOpenAI({
    apiKey: token,
    baseURL: endpoint,
});

const model = client("openai/gpt-4.1");

export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const body = await req.json();
    const userMessage = body.message;
    if (!userMessage) {
        return new Response("Missing message", { status: 400 });
    }
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const generatedTitle = await generateText({
        model: model,
        messages: [{
            role: "user",
            content: `Je viens de commancer une discussion avec toi. Génére un titre de moins de 120 caractères à la conversation sachant que ceci est son premier message:"${userMessage}"`
        }],
    });

    const chat = await prisma.chat.create({
        data: {
            title: generatedTitle.text,
            userId: session.user.id,
        },
    });

    await prisma.message.create({
        data: {
            role: "user",
            content: userMessage,
            chatId: chat.id,
        },
    });

    const aiResponse = streamText({
        model: model,
        system: "Your name is niato ai and you are a helpful assistant. Always be kind and helpful.",
        experimental_transform: smoothStream(),
        temperature: 1,
        messages: [{ role: "user", content: userMessage }],
    });

    let fullText = '';

    for await (const textPart of aiResponse.textStream) {
        fullText += textPart;
    }

    await prisma.message.create({
        data: {
            role: "assistant",
            content: fullText,
            chatId: chat.id,
        },
    });
    revalidatePath("/app/chat");

    return Response.json({ chatId: chat.id });
}
