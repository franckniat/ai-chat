import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

/**
 * Session courante, ou null. A utiliser partout plutot que de reappeler
 * `auth.api.getSession` avec les headers a la main.
 */
export async function getCurrentSession() {
    return auth.api.getSession({ headers: await headers() });
}

/**
 * Verifie qu'une conversation existe ET appartient a l'utilisateur donne.
 *
 * Indispensable des qu'un `chatId` vient du client : sans ce filtre, n'importe
 * quel compte authentifie peut lire, ecrire ou supprimer la conversation d'un
 * autre en devinant / reutilisant son identifiant (IDOR).
 */
export async function assertChatOwnership(chatId: string, userId: string) {
    const chat = await prisma.chat.findFirst({
        where: { id: chatId, userId },
        select: { id: true },
    });
    return chat !== null;
}
