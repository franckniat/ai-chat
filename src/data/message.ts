"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getMessagesByChatId = async (chatId: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return [];
    }
    return prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" },
    });
}
