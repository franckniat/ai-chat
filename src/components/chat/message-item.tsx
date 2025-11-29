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
import { Source, Sources, SourcesContent, SourcesTrigger } from "../ai-elements/sources";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "../ai-elements/reasoning";

// Composant mémorisé pour chaque message
export const MessageItem = memo(({ message }: { message: UIMessage }) => {
    const { regenerate, messages, status } = useChatContext();
    return (
        <div key={message.id}>
            <div className="flex-1 space-y-2 w-full">
                <Fragment key={message.id}>
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return (
                                    <Fragment key={`${message.id}-${i}`}>
                                        {message.role === "assistant" &&
                                            message.parts.filter(
                                                (part) => part.type === "source-url"
                                            ).length > 0 && (
                                                <Sources>
                                                    <SourcesTrigger
                                                        count={
                                                            message.parts.filter(
                                                                (part) => part.type === "source-url"
                                                            ).length
                                                        }
                                                    />
                                                    {message.parts
                                                        .filter(
                                                            (part) => part.type === "source-url"
                                                        )
                                                        .map((part, i) => (
                                                            <SourcesContent
                                                                key={`${message.id}-${i}`}
                                                            >
                                                                <Source
                                                                    key={`${message.id}-${i}`}
                                                                    href={part.url}
                                                                    title={part.url}
                                                                />
                                                            </SourcesContent>
                                                        ))}
                                                </Sources>
                                            )}
                                        <Message from={message.role}>
                                            <MessageContent>
                                                <MessageResponse isAnimating={message.role === "assistant" && status === "streaming"}>
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
                            case "reasoning":
                                return (
                                    <Reasoning
                                        key={`${message.id}-${i}`}
                                        className="w-full"
                                        isStreaming={
                                            status === "streaming" &&
                                            i === message.parts.length - 1 &&
                                            message.id === messages.at(-1)?.id
                                        }
                                    >
                                        <ReasoningTrigger />
                                        <ReasoningContent>{part.text}</ReasoningContent>
                                    </Reasoning>
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
