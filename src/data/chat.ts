"use server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getUserChatList = async (userId: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return [];
    }
    const chats = await prisma.chat.findMany({
        where: {
            userId: userId,
        },
    });
    return chats;
}