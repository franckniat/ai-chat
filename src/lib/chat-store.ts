import prisma from "@/lib/db";
import { type UIMessage, generateId } from 'ai';
import { Message as PrismaMessage } from "@niato-ai/prisma-client";

export interface ChatWithMessages {
    id: string;
    title: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    messages: UIMessage[];
}

export async function createDbChat(
    userId: string,
    title: string
): Promise<string> {
    const chat = await prisma.chat.create({
        data: {
            userId,
            title,
        },
    });
    return chat.id;
}

export async function saveMessage(
    chatId: string,
    role: "user" | "assistant" | "system" | "tool",
    content: string
): Promise<PrismaMessage> {
    const message = await prisma.message.create({
        data: {
            id: generateId(),
            chatId,
            role,
            content,
        },
    });
    await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
    });
    return message;
}

export async function getChatWithMessages(chatId: string, userId: string): Promise<ChatWithMessages | null> {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId, userId }, // S'assurer que l'utilisateur possède le chat
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    if (!chat) {
        return null;
    }

    return {
        ...chat,
        messages: chat.messages.map(msg => ({
            id: msg.id,
            role: msg.role as UIMessage['role'],
            content: msg.content,
            parts: [
                {
                    type: 'text' as const,
                    text: msg.content,
                }
            ],
        })),
    };
}

export async function getChatsForUser(userId: string): Promise<Pick<ChatWithMessages, 'id' | 'title' | 'userId' | 'createdAt' | 'updatedAt'>[]> {
    return prisma.chat.findMany({
        where: { userId },
        select: {
            id: true,
            title: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
    });
}

export async function updateChatTitle(chatId: string, title: string): Promise<void> {
    await prisma.chat.update({
        where: { id: chatId },
        data: { title },
    });
}

export const titlePrompt = `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`
