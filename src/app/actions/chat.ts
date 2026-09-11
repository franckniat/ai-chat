"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { assertChatOwnership, getCurrentSession } from "@/lib/authz";

/**
 * Resout la session et verifie que la conversation ciblee appartient bien a
 * l'appelant.
 *
 * Les Server Actions sont des endpoints publics : l'identifiant passe en
 * argument vient du client et ne doit jamais etre utilise seul dans un `where`.
 */
async function requireChatOwner(chatId: string) {
	const session = await getCurrentSession();

	if (!session) {
		redirect("/login");
	}

	const ownsChat = await assertChatOwnership(chatId, session.user.id);
	if (!ownsChat) {
		throw new Error("Chat not found");
	}

	return session;
}

export const deleteChatById = async (chatId: string) => {
	await requireChatOwner(chatId);

	try {
		// Suppression douce
		await prisma.chat.update({
			where: { id: chatId },
			data: {
				deleted: true,
				deletedAt: new Date(),
			},
		});

		revalidatePath("/chat");
		return { success: true, message: "Chat deleted successfully!" };
	} catch (error) {
		console.error("Erreur lors de la suppression:", error);
		throw new Error("Une erreur est survenue lors de la suppression");
	}
};

export const hardDeleteChat = async (chatId: string) => {
	await requireChatOwner(chatId);

	try {
		await prisma.chat.delete({
			where: { id: chatId },
		});
		revalidatePath("/chat");
		return { success: true, message: "Chat permanently deleted!" };
	} catch (error) {
		console.error("Error during permanent deletion:", error);
		throw new Error("An error occurred during permanent deletion");
	}
};

export const restoreChat = async (id: string) => {
	await requireChatOwner(id);

	try {
		await prisma.chat.update({
			where: { id },
			data: {
				deleted: false,
				deletedAt: null,
			},
		});

		revalidatePath("/");
		return { success: true, message: "Chat restored successfully!" };
	} catch (error) {
		console.error("Erreur lors de la restauration:", error);
		throw new Error("Une erreur est survenue lors de la restauration");
	}
};
