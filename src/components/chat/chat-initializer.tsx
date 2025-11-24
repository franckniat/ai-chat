"use client";

import { useEffect, useRef } from "react";
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
    const initialized = useRef(false);

    useEffect(() => {
        // On met à jour l'ID et les messages quand on change de page
        // On évite de le faire si l'ID est le même pour ne pas reset l'état inutilement
        // Sauf si c'est la première fois (montage)

        // Si on vient de créer un chat (navigation depuis /chat vers /chat/[id]),
        // le Provider a peut-être déjà les messages en mémoire via useChat.
        // Mais useChat ne garde pas les messages si on change l'API endpoint ?
        // Si, useChat garde l'état tant qu'il n'est pas démonté.

        // Si on navigue, le Provider reste monté.
        // Si on change l'ID, on doit mettre à jour l'API endpoint dans le Provider.

        if (id !== chatId || !initialized.current) {
            setChatId(id);
            if (initialMessages && initialMessages.length > 0) {
                 setMessages(initialMessages);
            } else if (!id) {
                // Si on est sur /chat, on reset
                setMessages([]);
            }
            initialized.current = true;
        }
    }, [id, initialMessages, setChatId, setMessages, chatId]);

    return null;
}
