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
import { Loader } from "@/components/ai-elements/loader";
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
        } else if (
            status === "submitted" ||
            (messages.length > 0 && messages[messages.length - 1].role === "user")
        ) {
            // Quand l'utilisateur envoie un message, scroll instantané pour le voir
            scrollToBottom("instant");
        }
    }, [messages, status, scrollToBottom]);

    const isLoading = status === "submitted" || isCreatingChat;
    const isStreaming = status === "streaming";

    return (
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
            {messages.length === 0 && !isLoading ? (
                <ConversationEmptyState
                    icon={<Sparkles className="size-10" />}
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
                        <div className="text-muted-foreground flex items-center gap-2 py-2 text-sm">
                            <Loader size={16} />
                            <span>Creating conversation...</span>
                        </div>
                    )}

                    {/* Loading indicator for AI response */}
                    {!isCreatingChat && status === "submitted" && !isStreaming && (
                        <div className="text-muted-foreground flex items-center gap-2 py-2 text-sm">
                            <Loader size={16} />
                            <span>Thinking...</span>
                        </div>
                    )}
                </>
            )}
        </ConversationContent>
    );
}

/**
 * Unique zone scrollable de la page : la coquille (chat/layout.tsx) est en
 * hauteur fixe, et `Conversation` occupe l'espace restant au-dessus du
 * composeur.
 */
export default function MessageList() {
    return (
        <Conversation className="flex-1">
            <MessageListContent />
            <ConversationScrollButton />
        </Conversation>
    );
}
