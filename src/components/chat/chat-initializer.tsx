"use client";

import { useEffect } from "react";
import { useChatContext } from "./chat-context";
import { UIMessage } from "ai";

export default function ChatInitializer({
    id,
    initialMessages,
}: {
    id: string | null;
    initialMessages: UIMessage[];
}) {
    const { setChatId, setMessages, chatId } = useChatContext();

    useEffect(() => {
        // Met à jour l'ID et les messages quand on change de page
        // On évite de le faire si l'ID est le même ET que les messages n'ont pas changé
        if (id !== chatId) {
            setChatId(id);
            setMessages(initialMessages);
        }
    }, [id, chatId, initialMessages, setChatId, setMessages]);

    return null;
}
