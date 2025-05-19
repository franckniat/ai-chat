"use client";

import * as React from "react";
import FormChat from "./form-chat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Message } from "@niato-ai/prisma-client"
import { useSession } from "@/lib/auth-client";

export default function MessagesContent({
    chatID,
    messages,
}: {
    chatID: string;
    messages: Message[];
}) {
    const { data: session } = useSession();
    const [input, setInput] = React.useState("");
    const [isPending, startTransition] = React.useTransition();

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            
        });
    };

    return (
        <div className="relative">
            {messages.length > 0 && <div className="space-y-5 max-w-[800px] mx-auto px-3">
                {messages &&
                    messages.map((m) => (
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
                            <div className="flex-1 space-y-2">
                                <p className="font-bold">
                                    {m.role == "user"
                                        ? session?.user?.name
                                        : "Chat Assistant 🤖"}
                                </p>
                                <div className="result-ai text-foreground/90">
                                    {m.content}
                                </div>
                                <div className="absolute -bottom-2 right-2">
                                    <p className="text-sm text-foreground/40">
                                        {m.createdAt &&
                                            m.createdAt.toLocaleTimeString(
                                                "fr-FR",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                }
                                            )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>}
            {chatID === "" && (
                <div className="max-w-3xl mx-auto px-3 pt-[50px]">
                    <h1 className="text-3xl text-center font-bold">
                        niato<span className="text-primary"> ai.</span>
                    </h1>
                    <h2 className="text-xl font-semibold text-foreground/70 text-center my-3">
                        Commencer à discuter avec l&#39;assistant
                    </h2>
                </div>
            )}
            <div className="my-2"></div>
            <FormChat
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                handleSubmit={handleSendMessage}
                isLoading={isPending}
            />
        </div>
    );
}