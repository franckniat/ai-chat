"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { ChatContext } from "./chat-context";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import FormChat from "./form-chat";
import { DefaultChatTransport, type UIMessage } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import { FREE_MODELS } from "@/lib/free-models";

export const models = FREE_MODELS;

const MAX_AUTO_FALLBACK_ATTEMPTS = 2;

function isRateLimitedError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error ?? "");
    return /429|rate[- ]?limit|temporarily rate-limited|retry shortly/i.test(message);
}

function getNextModelId(currentModelId: string) {
    const currentIndex = models.findIndex((model) => model.id === currentModelId);
    if (currentIndex === -1 || currentIndex >= models.length - 1) {
        return null;
    }
    return models[currentIndex + 1]?.id ?? null;
}

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
    const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
    const selectedModelData = models.find((model) => model.id === selectedModel);
    const [input, setInput] = useState("");
    const [model, setModel] = useState<string>(models[0].id);
    const [selectedPersonality, setSelectedPersonality] = useState<string>("default");
    const selectedModelRef = useRef(selectedModel);
    const selectedPersonalityRef = useRef(selectedPersonality);
    const chatIdRef = useRef<string | null>(chatId);
    const fallbackAttemptsRef = useRef(0);
    const regenerateRef = useRef<((options?: { body?: Record<string, unknown> }) => void) | null>(null);

    useEffect(() => {
        selectedModelRef.current = selectedModel;
    }, [selectedModel]);

    useEffect(() => {
        selectedPersonalityRef.current = selectedPersonality;
    }, [selectedPersonality]);

    useEffect(() => {
        chatIdRef.current = chatId;
    }, [chatId]);

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
            if (isRateLimitedError(error) && fallbackAttemptsRef.current < MAX_AUTO_FALLBACK_ATTEMPTS) {
                const currentModelId = selectedModelRef.current;
                const nextModelId = getNextModelId(currentModelId);

                if (nextModelId && regenerateRef.current) {
                    fallbackAttemptsRef.current += 1;
                    setSelectedModel(nextModelId);

                    const currentModelName = models.find((model) => model.id === currentModelId)?.name ?? currentModelId;
                    const nextModelName = models.find((model) => model.id === nextModelId)?.name ?? nextModelId;

                    toast.warning(
                        `${currentModelName} est limite temporairement. Reprise automatique avec ${nextModelName}...`
                    );

                    regenerateRef.current({
                        body: {
                            chatId: chatIdRef.current,
                            modelId: nextModelId,
                            personality: selectedPersonalityRef.current,
                        },
                    });
                    return;
                }
            }

            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
            setIsCreatingChat(false);
        },
        onFinish: ({ message }) => {
            fallbackAttemptsRef.current = 0;

            // Refresh sidebar after generation is complete
            const metadata = message.metadata as MessageMetadata | undefined;
            if (metadata?.isComplete) {
                router.refresh();
            }
            setIsCreatingChat(false);
        },
        experimental_throttle: 50, // Throttle UI updates for performance
    });

    useEffect(() => {
        regenerateRef.current = originalRegenerate as (options?: { body?: Record<string, unknown> }) => void;
    }, [originalRegenerate]);

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
        fallbackAttemptsRef.current = 0;

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
        fallbackAttemptsRef.current = 0;

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

