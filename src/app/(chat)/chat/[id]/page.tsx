import MessagesContent from "@/components/chat/messages";
import { auth } from "@/lib/auth";
import { getChatWithMessages } from "@/lib/chat-store";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Message as AIMessage } from "@ai-sdk/react";

export default async function ExistingChatPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		redirect(`/login?next=/chat/${id}`);
	}

	const chatData = await getChatWithMessages(id, session.user.id);

	if (!chatData) {
		redirect("/chat");
	}

	return (
		<>
			<MessagesContent
				id={chatData.id}
				initialMessages={chatData.messages as AIMessage[]}
			/>
		</>
	);
}
