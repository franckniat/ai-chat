"use client";

import { type UIMessage } from "ai";
import { createContext, useContext } from "react";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import { models } from "./chat-provider";

export interface ChatContextType {
    messages: UIMessage[];
    input: string;
    model: string;
    setModel: (model: string) => void;
    useWebSearch: boolean;
    setUseWebSearch: (value: boolean) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    selectedModelData: (typeof models)[0] | undefined;
    handleSubmit: (message: PromptInputMessage) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    status: "streaming" | "submitted" | "ready" | "error";
    stop: () => void;
    regenerate: () => void;
    setMessages: (messages: UIMessage[]) => void;
    setChatId: (id: string | null) => void;
    chatId: string | null;
    isCreatingChat: boolean;
    setIsCreatingChat: (value: boolean) => void;
    error: undefined | Error;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
}
