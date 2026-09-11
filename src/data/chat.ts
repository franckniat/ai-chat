"use server";
import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/authz";

export const getUserChatList = async () => {
	const session = await getCurrentSession();
	if (!session) {
		return [];
	}

	// L'userId vient de la session, jamais d'un argument : une Server Action est
	// un endpoint public, un userId passe en parametre serait choisi par l'appelant.
	return prisma.chat.findMany({
		where: {
			userId: session.user.id,
			deleted: false,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});
};

export const getChatById = async (chatId: string) => {
	const session = await getCurrentSession();
	if (!session) {
		return null;
	}

	return prisma.chat.findFirst({
		where: {
			id: chatId,
			userId: session.user.id,
			deleted: false,
		},
	});
};
