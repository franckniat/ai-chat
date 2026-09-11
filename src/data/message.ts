"use server";

import prisma from "@/lib/db";
import { assertChatOwnership, getCurrentSession } from "@/lib/authz";

export const getMessagesByChatId = async (chatId: string) => {
    const session = await getCurrentSession();
    if (!session) {
        return [];
    }

    // Une session valide ne suffit pas : il faut que la conversation appartienne
    // bien a cet utilisateur, sinon n'importe quel compte peut lire les messages
    // d'un autre en passant son chatId.
    const ownsChat = await assertChatOwnership(chatId, session.user.id);
    if (!ownsChat) {
        return [];
    }

    return prisma.message.findMany({
        where: { chatId, deleted: false },
        orderBy: { createdAt: "asc" },
    });
};
