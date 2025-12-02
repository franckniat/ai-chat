"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";

export const deleteChatById = async (chatId: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }
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
}

export const hardDeleteChat = async (chatId: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		redirect("/login");
	}
	try {
		await prisma.chat.delete({
			where: { id: chatId },
		});
		revalidatePath("/chat");
		return { success: true, message: "Chat permanently deleted!" };
	} catch (error) {
		console.error("Error during permanent deletion:", error);
		throw new Error(
			"An error occurred during permanent deletion",
		);
	}
};

export const restoreChat = async (id: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

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
