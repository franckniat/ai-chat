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
        regenerate: originalRegenerate,
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
        onData: (dataPart) => {
            // Récupérer le chatId depuis les données du stream
            if (!chatId && dataPart.type === 'data-message' && dataPart.data) {
                const messageData = dataPart.data as { chatId?: string };
                if (messageData.chatId) {
                    setChatId(messageData.chatId);
                    router.push(`/chat/${messageData.chatId}`);
                }
            }
        },
    });

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
        sendMessage(
            { text: input },
            {
                body: {
                    chatId: chatId
                }
            }
        );
        setInput("");
    };

    // Wrapper pour regenerate qui inclut le chatId
    const regenerate = () => {
        if (chatId) {
            originalRegenerate({
                body: {
                    chatId: chatId
                }
            });
        } else {
            // Si pas de chatId, utiliser la fonction originale
            originalRegenerate();
        }
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
