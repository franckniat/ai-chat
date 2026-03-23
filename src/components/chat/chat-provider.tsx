"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, ReactNode, useCallback } from "react";
import { ChatContext } from "./chat-context";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import FormChat from "./form-chat";
import { DefaultChatTransport, type UIMessage } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";

export const models = [
    {
        id: "openai/gpt-4o-mini",
        name: "GPT-4o Mini",
        chef: "OpenAI",
        chefSlug: "openai",
        providers: ["openai"],
        isReasoning: false,
    },
    {
        id: "deepseek/deepseek-chat",
        name: "DeepSeek V3",
        chef: "DeepSeek",
        chefSlug: "deepseek",
        providers: ["deepseek"],
        isReasoning: false,
    },
    {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        chef: "DeepSeek",
        chefSlug: "deepseek",
        providers: ["deepseek"],
        isReasoning: true,
    },
    {
        id: "meta-llama/llama-3.3-70b-instruct",
        name: "Llama 3.3 70B",
        chef: "Meta",
        chefSlug: "meta",
        providers: ["meta"],
        isReasoning: false,
    },
];

// Type pour les métadonnées des messages
interface MessageMetadata {
    chatId?: string;
    isNewChat?: boolean;
    isComplete?: boolean;
}

export default function ChatProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [chatId, setChatId] = useState<string | null>(null);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<string>("deepseek/deepseek-chat");
    const selectedModelData = models.find((model) => model.id === selectedModel);
    const [input, setInput] = useState("");
    const [model, setModel] = useState<string>(models[0].id);
    const [selectedPersonality, setSelectedPersonality] = useState<string>("default");

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
            } else {
                toast.error("An error occurred. Please try again.");
            }
            setIsCreatingChat(false);
        },
        onFinish: ({ message }) => {
            // Refresh sidebar after generation is complete
            const metadata = message.metadata as MessageMetadata | undefined;
            if (metadata?.isComplete) {
                router.refresh();
            }
            setIsCreatingChat(false);
        },
        experimental_throttle: 50, // Throttle UI updates for performance
    });

    // Detect new chat and redirect immediately when first assistant message arrives
    useEffect(() => {
        if (isCreatingChat && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "assistant") {
                const metadata = lastMessage.metadata as MessageMetadata | undefined;
                if (metadata?.chatId && metadata?.isNewChat) {
                    setChatId(metadata.chatId);
                    router.push(`/chat/${metadata.chatId}`);
                    setIsCreatingChat(false);
                }
            }
        }
    }, [messages, isCreatingChat, router]);

    // Reset isCreatingChat when streaming starts
    useEffect(() => {
        if (status === "streaming" && isCreatingChat) {
            // Garder isCreatingChat true jusqu'à onFinish
        }
    }, [status, isCreatingChat]);

    // Synchroniser le chatId avec le pathname
    useEffect(() => {
        const pathChatId = pathname.match(/\/chat\/([^/]+)/)?.[1];
        if (pathChatId && pathChatId !== chatId) {
            setChatId(pathChatId);
        } else if (pathname === "/chat" && chatId) {
            setChatId(null);
        }
    }, [pathname, chatId]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }, []);

    const handleSubmit = useCallback((message: PromptInputMessage) => {
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
                    modelId: selectedModel,
                    webSearch: useWebSearch,
                    personality: selectedPersonality,
                },
            }
        );
        setInput("");
    }, [chatId, input, selectedModel, useWebSearch, selectedPersonality, sendMessage]);

    // Wrapper pour regenerate qui inclut le chatId et le modèle
    const regenerate = useCallback(() => {
        if (chatId) {
            originalRegenerate({
                body: {
                    chatId: chatId,
                    modelId: selectedModel,
                    personality: selectedPersonality,
                },
            });
        } else {
            originalRegenerate();
        }
    }, [chatId, selectedModel, selectedPersonality, originalRegenerate]);

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
                selectedPersonality,
                setSelectedPersonality,
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

