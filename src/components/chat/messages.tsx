"use client";

import FormChat from "./form-chat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "@/lib/auth-client";
import { useChat } from "@ai-sdk/react";
import MessageFormatter from "./message-formatter";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function MessagesContent({ id }: { id?: string }) {
    const { data: session } = useSession();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        status,
        stop,
        error,
        reload,
    } = useChat({
        api: "/api/chat",
        onResponse: () => {
            setLoading(true);
        },
        onFinish: () => {
            setLoading(false);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const examples = [
        {
            title: "Write an email",
            content: "Write an email to my boss."
        },
        {
            title: "Learn React",
            content: "What is React?"
        },
        {
            title: "Write a poem",
            content: "Write a poem about the sea."
        },
        {
            title: "Tell a joke",
            content: "Tell me a joke about cats."
        }
    ]

    return (
        <div className="relative pb-24">
            <div className="space-y-5 max-w-[800px] mx-auto px-3">
                {!id &&
                    (
                        <div className="space-y-3 flex flex-col items-center">
                            <h1 className="text-2xl font-bold text-center">niato ai 🏄</h1>
                            <div className="grid grid-cols-4 gap-3">
                                {examples.map((example) => (
                                    <Card
                                        key={example.title}
                                        className="cursor-pointer hover:bg-foreground/5"
                                    >
                                        <CardContent>
                                            <p className="text-base font-bold">{example.title}</p>
                                            <p className="text-sm">{example.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                }
                {messages.map((m) => (
                    <div key={m.id} className="flex gap-2 py-6 relative">
                        {m.role === "user" ? (
                            <Avatar className="border-2 border-foreground/60 pointer-events-none cursor-pointer">
                                {session?.user.image ? (
                                    <AvatarImage src={session?.user.image} />
                                ) : (
                                    <AvatarFallback>
                                        {session?.user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        ) : (
                            <Avatar className="border-2 border-primary cursor-pointer pointer-events-none">
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                        )}
                        <div className="flex-1 space-y-2 group">
                            <p className="font-bold group-hover:text-primary">
                                {m.role == "user" ? session?.user?.name : "niato ai 🏄"}
                            </p>
                            <div className="result-ai text-foreground/90">
                                <MessageFormatter content={m.content} />
                            </div>
                            <div className="absolute -bottom-2 right-2 group-hover:block hidden">
                                <p className="text-sm text-foreground/40">
                                    {m.createdAt &&
                                        m.createdAt.toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {error && (
                    <>
                        <div>An error occurred.</div>
                        <Button type="button" onClick={() => reload()}>
                            Retry
                        </Button>
                    </>
                )}
            </div>
            <FormChat
                name="prompt"
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={status === "streaming" || status === "submitted"}
                stop={stop}
            />
        </div>
    );
}
