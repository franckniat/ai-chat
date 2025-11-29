"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, ReactNode } from "react";
import { ChatContext } from "./chat-context";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormChat from "./form-chat";
import { DefaultChatTransport } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";

export const models = [
    {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google", "google-vertex"],
    },
    {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        chef: "Google",
        chefSlug: "google",
        providers: ["google", "google-vertex"],
    },
    {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google", "google-vertex"],
    },
];

export default function ChatProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [chatId, setChatId] = useState<string | null>(null);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<string>("gemini-2.0-flash-exp");
    const selectedModelData = models.find((model) => model.id === selectedModel);
    const [input, setInput] = useState("");

    const [model, setModel] = useState<string>(models[0].id);
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
            api: "/api/chat",
        }),
        onError: (error) => {
            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            }
        },
        onData: (dataPart) => {
            // Récupérer le chatId depuis les données du stream
            if (!chatId && dataPart.type === "data-message" && dataPart.data) {
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
    };

    const handleSubmit = (message: PromptInputMessage) => {
        if (!chatId) {
            setIsCreatingChat(true);
        }
        const hasText = Boolean(message.text);
        const hasAttachments = Boolean(message.files?.length);
        if (!(hasText || hasAttachments)) {
            return;
        }
        sendMessage(
            {
                text: input,
                files: message.files,
            },
            {
                body: {
                    chatId: chatId,
                    webSearch: useWebSearch,
                },
            }
        );
        setInput("");
    };

    // Wrapper pour regenerate qui inclut le chatId
    const regenerate = () => {
        if (chatId) {
            originalRegenerate({
                body: {
                    chatId: chatId,
                },
            });
        } else {
            // Si pas de chatId, utiliser la fonction originale
            originalRegenerate();
        }
    };

    return (
        <ChatContext.Provider
            value={{
                selectedModel,
                setSelectedModel,
                selectedModelData,
                useWebSearch,
                setUseWebSearch,
                setModel,
                messages,
                model,
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
