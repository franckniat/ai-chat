"use client";

import {
    Message,
    MessageContent,
    MessageResponse,
    MessageActions,
    MessageAction,
} from "@/components/ai-elements/message";
import { memo, Fragment } from "react";
import { RefreshCcwIcon, CopyIcon } from "lucide-react";
import { type UIMessage } from "ai";
import { useChatContext } from "./chat-context";

// Composant mémorisé pour chaque message
export const MessageItem = memo(({ message }: { message: UIMessage }) => {
    const { regenerate } = useChatContext();
    return (
        <div key={message.id} className="flex flex-col sm:flex-row gap-4 py-3 relative group">
            <div className="flex-1 space-y-2 w-full">
                <Fragment key={message.id}>
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return (
                                    <Fragment key={`${message.id}-${i}`}>
                                        <Message from={message.role}>
                                            <MessageContent>
                                                <MessageResponse className="prose prose-base prose-neutral dark:prose-invert prose-headings:font-mono tracking-[0.03rem]">
                                                    {part.text}
                                                </MessageResponse>
                                            </MessageContent>
                                        </Message>
                                        {message.role === "assistant" && (
                                            <MessageActions>
                                                <MessageAction
                                                    onClick={() => regenerate()}
                                                    tooltip="Retry"
                                                >
                                                    <RefreshCcwIcon className="size-3" />
                                                </MessageAction>
                                                <MessageAction
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(part.text)
                                                    }
                                                    tooltip="Copy"
                                                >
                                                    <CopyIcon className="size-3" />
                                                </MessageAction>
                                            </MessageActions>
                                        )}
                                    </Fragment>
                                );
                            default:
                                return null;
                        }
                    })}
                </Fragment>
            </div>
        </div>
    );
});

MessageItem.displayName = "MessageItem";
