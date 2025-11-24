"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, ReactNode } from "react";
import { ChatContext } from "./chat-context";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormChat from "./form-chat";
import { DefaultChatTransport } from "ai";

export default function ChatProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [chatId, setChatId] = useState<string | null>(null);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [input, setInput] = useState("");

    const {
        regenerate,
        messages,
        sendMessage,
        status,
        stop,
        error,
        setMessages,
    } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat"
        }),
        onError: (error) => {
            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            }
        },
    });

    // Redirection après la création du chat
    useEffect(() => {
        if (!chatId && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            // Vérifier si le dernier message contient un chatId dans ses métadonnées
            if (lastMessage.metadata && typeof lastMessage.metadata === 'object') {
                const metadata = lastMessage.metadata as { chatId?: string };
                if (metadata.chatId) {
                    setChatId(metadata.chatId);
                    router.push(`/chat/${metadata.chatId}`);
                }
            }
        }
    }, [messages, chatId, router, setChatId]);

    // Reset isCreatingChat quand le streaming commence
    useEffect(() => {
        if (status === "streaming" && isCreatingChat) {
            setIsCreatingChat(false);
        }
    }, [status, isCreatingChat]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }

    const handleSubmit = () => {
        if (!chatId) {
            setIsCreatingChat(true);
        }
        sendMessage({text: input});
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                input,
                handleSubmit,
                handleInputChange,
                status,
                regenerate,
                stop,
                setMessages,
                setChatId,
                chatId,
                isCreatingChat,
                setIsCreatingChat,
                error,
            }}
        >
            <div className="relative flex flex-col h-full w-full">
                <div className="flex-1 w-full">{children}</div>
                <FormChat
                    name="prompt"
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={status === "streaming" || status === "submitted" || isCreatingChat}
                    stop={stop}
                />
            </div>
        </ChatContext.Provider>
    );
}
