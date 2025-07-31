import prisma from "@/lib/db";
import { type Message as AIMessage } from 'ai';
import { Message as PrismaMessage } from "@niato-ai/prisma-client";

export interface ChatWithMessages {
    id: string;
    title: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    messages: AIMessage[];
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
    role: AIMessage["role"],
    content: string
): Promise<PrismaMessage> {
    const message = await prisma.message.create({
        data: {
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
            role: msg.role as AIMessage['role'],
            content: msg.content,
            createdAt: msg.createdAt,
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
