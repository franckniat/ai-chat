"use client";

import FormChat from "./form-chat";
import { Avatar } from "../ui/avatar";
import { useChat } from "@ai-sdk/react";
import MessageFormatter from "./message-formatter";
import { useEffect, memo, useState, useRef } from "react";
import { Button } from "../ui/button";
import { type UIMessage as AIMessage } from "@ai-sdk/react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useMessages } from "@/hooks/use-messages";
import { DefaultChatTransport } from "ai";

// Composant mémorisé pour chaque message
const MessageItem = memo(({ message }: { message: AIMessage }) => {
    return (
        <div key={message.id} className="flex flex-col sm:flex-row gap-4 py-3 relative">
            <div className="flex-1 space-y-2 group tracking-tight w-full">
                {message.role === "user" && (
                    <div className="flex justify-end w-full">
                        <div className="bg-foreground/10 border border-foreground/15 rounded-xl px-5 py-3">
                            {message.parts.map((part, index) => (
                                <p key={index} className="whitespace-pre-wrap">
                                    {part.type === "text" ? part.text : null}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
                {message.role === "assistant" && (
                    <div className="result-ai text-foreground/90 prose prose-base prose-neutral dark:prose-invert prose-headings:font-mono tracking-[0.03rem] max-w-[800px]">
                        {message.parts.map((part, index) => (
                            <MessageFormatter key={index} content={part.type === "text" ? part.text : ""} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

MessageItem.displayName = "MessageItem";

export default function MessagesContent({
    id,
    initialMessages,
}: {
    id?: string;
    initialMessages?: AIMessage[];
}) {
    const [input, setInput] = useState("");
    const lastMessageContentRef = useRef<string>("");
    const {
        messages,
        sendMessage,
        status,
        stop,
        error,
        regenerate
    } = useChat({
        id,
        transport: new DefaultChatTransport({
            api: "/api/chat"
        }),
        messages: initialMessages,
        onError: (error) => {
            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            }
        },
    });
    const {
        containerRef,
        endRef,
        isAtBottom,
        scrollToBottom,
        onViewportEnter,
        onViewportLeave,
        hasSentMessage,
    } = useMessages({
        chatId: id || "",
        status,
    });

    // Gestion automatique du défilement avec Intersection Observer
    useEffect(() => {
        const endElement = endRef.current;
        if (!endElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onViewportEnter();
                } else {
                    onViewportLeave();
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px -200px",
            }
        );

        observer.observe(endElement);

        return () => {
            observer.disconnect();
        };
    }, [onViewportEnter, onViewportLeave, endRef]);

    // Défilement automatique lors de nouveaux messages
    useEffect(() => {
        // Scroll immédiat quand l'utilisateur envoie un message
        if (hasSentMessage && status === "submitted") {
            scrollToBottom("smooth");
            return;
        }

        // Scroll continu pendant le streaming de la réponse IA
        if (status === "streaming") {
            const timer = setTimeout(() => {
                scrollToBottom("smooth");
            }, 100);
            return () => clearTimeout(timer);
        }

        // Scroll quand un nouveau message arrive si on est proche du bas
        if (hasSentMessage && isAtBottom) {
            const timer = setTimeout(() => {
                scrollToBottom("smooth");
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [messages.length, hasSentMessage, isAtBottom, status, scrollToBottom]);

    // Scroll automatique lors du changement de contenu des messages (streaming)
    useEffect(() => {
        if (status === "streaming" && messages.length > 0) {
            // Obtenir le dernier message (celui de l'IA)
            const lastMessage = messages[messages.length - 1];
            if (lastMessage?.role === "assistant") {
                // Utiliser un délai plus court pour un scroll plus fluide pendant le streaming
                const timer = setTimeout(() => {
                    scrollToBottom("smooth");
                }, 50);
                return () => clearTimeout(timer);
            }
        }
    }, [messages, status, scrollToBottom]);

    // Effet spécifique pour le streaming - se déclenche à chaque mise à jour du contenu
    useEffect(() => {
        if (status === "streaming") {
            const timer = setInterval(() => {
                scrollToBottom("smooth");
            }, 150); // Scroll toutes les 150ms pendant le streaming

            return () => clearInterval(timer);
        }
    }, [status, scrollToBottom]);

    // Détecter les changements de contenu du dernier message pendant le streaming
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage?.role === "assistant" && status === "streaming") {
                const currentContent = lastMessage.parts.find(p => p.type === "text")?.text || "";
                if (currentContent !== lastMessageContentRef.current) {
                    lastMessageContentRef.current = currentContent;
                    // Scroll quand le contenu change
                    setTimeout(() => scrollToBottom("smooth"), 50);
                }
            }
        }
    }, [messages, status, scrollToBottom]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage({ text: input });
    };

    return (
        <div className="relative pb-24">
            <div ref={containerRef} className="space-y-3 md:space-y-5 max-w-[800px] mx-auto px-3">
                {!id && (
                    <div className="space-y-3 flex flex-col items-center">
                        <Sparkles className="h-8 w-8 animate-pulse" />
                        <p className="text-center text-muted-foreground">
                            How can I help you today ?
                        </p>
                    </div>
                )}
                {messages.map((m) => (
                    <MessageItem key={m.id} message={m} />
                ))}
                {status === "submitted" && (
                    <div className="flex flex-col sm:flex-row gap-2 py-6 relative">
                        <Avatar className="border-2 border-primary cursor-pointer pointer-events-none flex items-center justify-center">
                            <Bot size={20} />
                        </Avatar>
                        <div className="flex-1 space-y-2 group">
                            <p className="font-bold group-hover:text-primary">niato ai 🏄</p>
                            <div className="result-ai text-foreground/90">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-sm text-foreground/60">
                                        Réflexion en cours...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="space-y-2">
                        <div className="text-red-500">Une erreur s&apos;est produite.</div>
                        <Button type="button" onClick={() => regenerate()} variant="outline" size="sm">
                            Réessayer
                        </Button>
                    </div>
                )}
                <div ref={endRef} className="h-1" />
            </div>
            <FormChat
                name="prompt"
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                handleSubmit={handleSubmit}
                isLoading={status === "streaming" || status === "submitted"}
                stop={stop}
            />
        </div>
    );
}
