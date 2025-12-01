"use client";

import { useChatContext } from "./chat-context";
import { Sparkles } from "lucide-react";
import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from "../ai-elements/conversation";
import { MessageItem } from "./message-item";
import { Loader } from '@/components/ai-elements/loader';
import { useEffect, useRef } from "react";

export default function MessageList() {
    const { messages, status, isCreatingChat } = useChatContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        if (status === "streaming" || status === "submitted") {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, status]);

    const isLoading = status === 'submitted' || isCreatingChat;
    const isStreaming = status === 'streaming';

    return (
        <div className="relative pb-24 h-full">
            <div className="space-y-3 md:space-y-5 max-w-[800px] mx-auto px-3 h-full">
                <div className="flex flex-col h-full">
                    <Conversation className="relative max-h-[100vh-320px] h-full">
                        <ConversationContent>
                            {messages.length === 0 && !isLoading ? (
                                <ConversationEmptyState
                                    icon={<Sparkles className="size-12" />}
                                    title="Start a conversation"
                                    description="Type a message below to begin chatting"
                                />
                            ) : (
                                <>
                                    {messages.map((m) => (
                                        <MessageItem key={m.id} message={m} />
                                    ))}

                                    {/* Loading indicator during submission */}
                                    {isLoading && !isStreaming && (
                                        <div className="flex items-center gap-2 text-muted-foreground py-4">
                                            <Loader size={20} />
                                            <span className="text-sm">
                                                {isCreatingChat
                                                    ? "Creating conversation..."
                                                    : "Thinking..."}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </ConversationContent>
                        <ConversationScrollButton />
                    </Conversation>
                </div>
            </div>
        </div>
    );
}
