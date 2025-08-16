"use client";

import FormChat from "./form-chat";
import { Avatar } from "../ui/avatar";
import { useChat } from "@ai-sdk/react";
import MessageFormatter from "./message-formatter";
import { useEffect, memo, useMemo, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { type Message as AIMessage } from "@ai-sdk/react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useMessages } from "@/hooks/use-messages";

// Composant mémorisé pour chaque message
const MessageItem = memo(({ message }: { message: AIMessage }) => (
    <div key={message.id} className="flex flex-col sm:flex-row gap-4 py-3 relative">
        <div className="flex-1 space-y-2 group tracking-tight w-full">
            {message.role === "user" && (
                <div className="flex justify-end w-full">
                    <div className="bg-foreground/10 border border-foreground/15 rounded-xl px-5 py-3">
                        {message.content}
                    </div>
                </div>
            )}
            {message.role === "assistant" && (
                <div className="result-ai text-foreground/90 prose prose-base prose-neutral dark:prose-invert prose-headings:font-mono tracking-[0.03rem] max-w-[800px]">
                    <MessageFormatter content={message.content} />
                </div>
            )}
            {message.role === "assistant" && (
                <div className="absolute -bottom-2 left-0 group-hover:block hidden">
                    <p className="text-sm text-foreground/40">
                        {message.createdAt &&
                            message.createdAt.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                    </p>
                </div>
            )}
        </div>
    </div>
));

MessageItem.displayName = "MessageItem";

export default function MessagesContent({
    id,
    initialMessages = [],
}: {
    id?: string;
    initialMessages?: AIMessage[];
}) {
    const router = useRouter();
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const lastMessageContentRef = useRef<string>("");
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        status,
        stop,
        error,
        reload,
        setMessages,
    } = useChat({
        api: `/api/chat/${id as string}`,
        initialMessages: initialMessages,
        onError: (error) => {
            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            }
        },
    });

    const handleFirstSubmit = async (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }

        setIsCreatingChat(true);

        try {
            const res = await fetch("/api/chat/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            if (!res.ok) {
                console.error("Error creating chat:", res.statusText);
                toast.error("Erreur lors de la création du chat");
                return;
            }

            const { chatId } = await res.json();
            // Redirection simple, la réponse IA est déjà générée
            router.push(`/chat/${chatId}`);
        } catch (error) {
            console.error("Error creating chat:", error);
            toast.error("Erreur lors de la création du chat");
        } finally {
            setIsCreatingChat(false);
        }
    };
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

    useEffect(() => {
        if (id && initialMessages.length > 0) {
            setMessages(initialMessages);
        } else if (!id) {
            setMessages([]);
        }
    }, [id, initialMessages, setMessages]);

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
                const currentContent = lastMessage.content;
                if (currentContent !== lastMessageContentRef.current) {
                    lastMessageContentRef.current = currentContent;
                    // Scroll quand le contenu change
                    setTimeout(() => scrollToBottom("smooth"), 50);
                }
            }
        }
    }, [messages, status, scrollToBottom]);

    const examples = useMemo(
        () => [
            {
                title: "Summarize an article",
                content: "Can you help me to summarize this article: ",
            },
            {
                title: "Learn React",
                content: "Show me how to create a simple React component.",
            },
            {
                title: "Write a poem",
                content: "Write a poem about the sea.",
            },
            {
                title: "Tell a joke",
                content: "Tell me a joke about cats.",
            },
        ],
        []
    );

    return (
        <div className="relative pb-24">
            <div ref={containerRef} className="space-y-3 md:space-y-5 max-w-[800px] mx-auto px-3">
                {!id && (
                    <div className="space-y-3 flex flex-col items-center">
                        <Sparkles className="h-8 w-8 animate-pulse" />
                        <p className="text-center text-muted-foreground">
                            How can I help you today ?
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {!isCreatingChat &&
                                examples.map((example) => (
                                    <Card
                                        key={example.title}
                                        onClick={() => {
                                            handleInputChange({
                                                target: { value: example.content },
                                            } as React.ChangeEvent<HTMLTextAreaElement>);
                                        }}
                                        className="cursor-pointer hover:bg-foreground/5"
                                    >
                                        <CardContent>
                                            <p className="text-base md:text-lg font-bold text-center">
                                                {example.title}
                                            </p>
                                            <p className="text-sm text-center text-muted-foreground">
                                                {example.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>
                )}
                {messages.map((m) => (
                    <MessageItem key={m.id} message={m} />
                ))}
                {(status === "submitted" || isCreatingChat) && (
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
                                        {isCreatingChat
                                            ? "Création de la conversation..."
                                            : "Réflexion en cours..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="space-y-2">
                        <div className="text-red-500">Une erreur s&apos;est produite.</div>
                        <Button type="button" onClick={() => reload()} variant="outline" size="sm">
                            Réessayer
                        </Button>
                    </div>
                )}
                <div ref={endRef} className="h-1" />
            </div>
            <FormChat
                name="prompt"
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={id ? handleSubmit : handleFirstSubmit}
                isLoading={status === "streaming" || status === "submitted" || isCreatingChat}
                stop={stop}
            />
        </div>
    );
}
