"use client";

import { useChatContext } from "./chat-context";
import { useMessages } from "@/hooks/use-messages";
import { useEffect, useMemo, useRef, memo, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Loader2, Sparkles, Copy, Share2, Check } from "lucide-react";
import MessageFormatter from "./message-formatter";
import { type UIMessage } from "ai";
import { toast } from "sonner";

// Composant mémorisé pour chaque message
const MessageItem = memo(({ message }: { message: UIMessage }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const textContent = message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");

        try {
            await navigator.clipboard.writeText(textContent);
            setCopied(true);
            toast.success("Copié dans le presse-papier");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Erreur lors de la copie");
            console.error("Erreur lors de la copie dans le presse-papier:", error);
        }
    };

    const handleShare = async () => {
        const textContent = message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Réponse niato ai",
                    text: textContent,
                });
            } catch (error) {
                console.error("Erreur lors du partage:", error);
            }
        } else {
            // Fallback : copier dans le presse-papier
            handleCopy();
        }
    };

    return (
        <div key={message.id} className="flex flex-col sm:flex-row gap-4 py-3 relative group">
            <div className="flex-1 space-y-2 tracking-tight w-full">
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
                    <div className="relative">
                        <div className="result-ai text-foreground/90 prose prose-base prose-neutral dark:prose-invert prose-headings:font-mono tracking-[0.03rem] max-w-[800px]">
                            {message.parts.map((part, index) => (
                                <MessageFormatter key={index} content={part.type === "text" ? part.text : ""} />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-4 w-4 mr-1" />
                                        <span className="text-xs">Copié</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-1" />
                                        <span className="text-xs">Copier</span>
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShare}
                                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                                <Share2 className="h-4 w-4 mr-1" />
                                <span className="text-xs">Partager</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

MessageItem.displayName = "MessageItem";

export default function MessageList() {
    const { messages, status, isCreatingChat, handleInputChange, regenerate, error, chatId } =
        useChatContext();
    const lastMessageContentRef = useRef<string>("");

    const {
        containerRef,
        endRef,
        isAtBottom,
        scrollToBottom,
        onViewportEnter,
        onViewportLeave,
        hasSentMessage,
    } = useMessages({
        chatId: chatId || "",
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
                const currentContent = lastMessage.parts.map(part => part.type === "text" ? part.text : "").join("");
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
                {!chatId && messages.length === 0 && (
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
                    <div className="flex items-baseline flex-row gap-2 py-6 relative">
                        <Avatar className="border-2 border-primary cursor-pointer pointer-events-none flex items-center justify-center">
                            <Loader2 size={20} className="text-primary animate-spin" />
                        </Avatar>
                        <div className="flex-1 space-y-2 group">
                            <p className="group-hover:text-primary text-sm">Thinking ...</p>
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
        </div>
    );
}
