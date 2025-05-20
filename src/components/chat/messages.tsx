"use client";

import FormChat from "./form-chat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "@/lib/auth-client";
import { useChat } from '@ai-sdk/react';
import MessageFormatter from "./message-formatter";
import { useState } from "react";

export default function MessagesContent() {
    const { data: session } = useSession();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        onResponse: () => {
            setLoading(true);
        },
        onFinish: () => {
            setLoading(false);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    return (
        <div className="relative pb-24">
            <div className="space-y-5 max-w-[800px] mx-auto px-3">
                {messages.map((m) => (
                    <div key={m.id} className="flex gap-2 py-6 relative">
                        {m.role === "user" ? (
                            <Avatar className="border-2 border-foreground/60 pointer-events-none cursor-pointer">
                                {session?.user.image ? (
                                    <AvatarImage src={session?.user.image} />
                                ) : (
                                    <AvatarFallback>
                                        {session?.user.name
                                            ?.charAt(0)
                                            .toUpperCase()}
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
                                {m.role == "user"
                                    ? session?.user?.name
                                    : "niato ai 🏄"}
                            </p>
                            <div className="result-ai text-foreground/90">
                                <MessageFormatter content={m.content} />
                            </div>
                            <div className="absolute -bottom-2 right-2 group-hover:block hidden">
                                <p className="text-sm text-foreground/40">
                                    {m.createdAt &&
                                        m.createdAt.toLocaleTimeString(
                                            "fr-FR",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <FormChat
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}