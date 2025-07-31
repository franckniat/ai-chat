import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createOpenAI } from "@ai-sdk/openai";
import { smoothStream, streamText } from "ai";
import { createDbChat, saveMessage } from "@/lib/chat-store";

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
    const body = await req.json();
    const userMessage = body.message as string;

    if (!userMessage) {
        return new Response("Missing message", { status: 400 });
    }
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }
    const model = client("openai/gpt-4.1");

    // Générer le titre d'abord
    const titleResult = streamText({
        model,
        messages: [{ role: "user", content: userMessage }],
        system: "Generate a short, concise title (maximum 6 words) for this chat conversation based on the user's message. Only return the title, nothing else.",
        experimental_transform: smoothStream(),
        temperature: 1,
    });

    let chatTitle = "";
    for await (const chunk of titleResult.textStream) {
        chatTitle += chunk;
    }

    // Créer le chat avec le titre généré
    let chatId = await createDbChat(session.user.id, chatTitle);
    await saveMessage(chatId, "user", userMessage);

    // Générer la réponse IA pour le premier message
    const aiResponse = streamText({
        model,
        messages: [{ role: "user", content: userMessage }],
        system: "Your name is niato ai and you are a helpful assistant. Always be kind and helpful.",
        experimental_transform: smoothStream(),
        temperature: 1,
    });

    let aiResponseText = "";
    for await (const chunk of aiResponse.textStream) {
        aiResponseText += chunk;
    }

    // Sauvegarder la réponse IA
    await saveMessage(chatId, "assistant", aiResponseText);

    revalidatePath(`/chat`);

    return Response.json({ chatId });
}
