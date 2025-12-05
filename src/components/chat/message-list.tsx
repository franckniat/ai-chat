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
import { useEffect } from "react";
import { useStickToBottomContext } from "use-stick-to-bottom";

// Composant interne pour gérer le scroll avec le contexte
function MessageListContent() {
    const { messages, status, isCreatingChat } = useChatContext();
    const { scrollToBottom } = useStickToBottomContext();

    // Scroll automatique pendant le streaming pour suivre les nouveaux tokens
    useEffect(() => {
        if (status === "streaming") {
            // Pendant le streaming, scroll en continu pour suivre le texte
            scrollToBottom("auto");
        } else if (status === "submitted" || (messages.length > 0 && messages[messages.length - 1].role === "user")) {
            // Quand l'utilisateur envoie un message, scroll instantané pour le voir
            scrollToBottom("instant");
        }
    }, [messages, status, scrollToBottom]);

    const isLoading = status === 'submitted' || isCreatingChat;
    const isStreaming = status === 'streaming';

    return (
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

                    {/* Loading indicator for creating new conversation */}
                    {isCreatingChat && !isStreaming && (
                        <div className="flex items-center gap-2 text-muted-foreground py-4">
                            <Loader size={20} />
                            <span className="text-sm">Creating conversation...</span>
                        </div>
                    )}

                    {/* Loading indicator for AI response */}
                    {!isCreatingChat && status === 'submitted' && !isStreaming && (
                        <div className="flex items-center gap-2 text-muted-foreground py-4">
                            <Loader size={20} />
                            <span className="text-sm">Thinking...</span>
                        </div>
                    )}
                </>
            )}
        </ConversationContent>
    );
}

export default function MessageList() {
    return (
        <div className="relative pb-24 h-full">
            <div className="space-y-3 md:space-y-5 max-w-[800px] mx-auto px-3 h-full">
                <div className="flex flex-col h-full mb-10">
                    <Conversation className="relative max-h-[100vh-320px] h-full">
                        <MessageListContent />
                        <ConversationScrollButton />
                    </Conversation>
                </div>
            </div>
        </div>
    );
}
