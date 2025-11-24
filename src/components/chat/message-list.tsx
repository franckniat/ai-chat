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

export default function MessageList() {
    const { messages, status } = useChatContext();

    return (
        <div className="relative pb-24">
            <div className="space-y-3 md:space-y-5 max-w-[800px] mx-auto px-3">
                <div className="flex flex-col h-full">
                    <Conversation className="relative">
                        <ConversationContent>
                            {messages.length === 0 ? (
                                <ConversationEmptyState
                                    icon={<Sparkles className="size-12" />}
                                    title="Start a conversation"
                                    description="Type a message below to begin chatting"
                                />
                            ) : (
                                messages.map((m) => <MessageItem key={m.id} message={m} />)
                            )}
                            {status === 'submitted' && <Loader />}
                        </ConversationContent>
                        <ConversationScrollButton />
                    </Conversation>
                </div>
            </div>
        </div>
    );
}
