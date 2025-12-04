"use client";

import {
    Message,
    MessageContent,
    MessageResponse,
    MessageActions,
    MessageAction,
} from "@/components/ai-elements/message";
import { Fragment, memo } from "react";
import { RefreshCcwIcon, CopyIcon, Copy, Loader } from "lucide-react";
import { type UIMessage } from "ai";
import { useChatContext } from "./chat-context";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { customVscDarkPlus } from "@/lib/syntax-theme";

// Composant mémorisé pour chaque message
export const MessageItem = memo(({ message }: { message: UIMessage }) => {
    const { regenerate, status } = useChatContext();
    const isStreaming = status === "streaming";
    const isSubmitted = status === "submitted";
    const isCurrentMessageStreaming = isStreaming && message.role === "assistant";

    // Collecter toutes les parties de reasoning
    const reasoningParts = message.parts.filter((part) => part.type === "reasoning");
    const hasReasoning = reasoningParts.length > 0;

    // Collecter les sources
    const sourceParts = message.parts.filter(
        (part) => part.type === "source-url" || part.type === "source-document"
    );
    const hasSources = sourceParts.length > 0;

    return (
        <div key={message.id}>
            <div className="flex-1 space-y-2 w-full">
                <Fragment key={message.id}>
                    {/* Afficher le reasoning si présent */}
                    {hasReasoning && isSubmitted && (
                        <Reasoning
                            isStreaming={isCurrentMessageStreaming}
                            defaultOpen={isCurrentMessageStreaming}
                        >
                            <ReasoningTrigger />
                            <ReasoningContent>
                                {reasoningParts
                                    .filter(
                                        (part): part is { type: "reasoning"; text: string } =>
                                            part.type === "reasoning"
                                    )
                                    .map((part) => part.text)
                                    .join("")}
                            </ReasoningContent>
                        </Reasoning>
                    )}

                    {message.parts
                        .filter((part) => part.type === "source-document")
                        .map((part) => (
                            <span key={`source-${part.filename}`}>
                                [<span>{part.title ?? `Document ${part.filename}`}</span>]
                            </span>
                        ))}

                    {/* Afficher les sources si présentes */}
                    {hasSources && !isCurrentMessageStreaming && (
                        <Sources>
                            <SourcesTrigger count={sourceParts.length} />
                            <SourcesContent>
                                {sourceParts.map((part, i) => {
                                    if (part.type === "source-url") {
                                        return (
                                            <Source
                                                key={`source-${message.id}-${i}`}
                                                href={part.url}
                                                title={part.title ?? new URL(part.url).hostname}
                                            />
                                        );
                                    }
                                    if (part.type === "source-document") {
                                        return (
                                            <Source
                                                key={`source-${message.id}-${i}`}
                                                href="#"
                                                title={part.title ?? `Document ${i + 1}`}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </SourcesContent>
                        </Sources>
                    )}

                    {/* Afficher le contenu texte */}
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return (
                                    <Fragment key={`${message.id}-${i}`}>
                                        <Message from={message.role}>
                                            <MessageContent>
                                                <MessageResponse
                                                    isAnimating={isCurrentMessageStreaming}
                                                    rehypePlugins={[rehypeRaw]}
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code: ({ className, style, ...props }) => {
                                                            let language;
                                                            if (className) {
                                                                language =
                                                                    className.replace(
                                                                        "language-",
                                                                        ""
                                                                    ) || "plainText";
                                                            }
                                                            const isInline =
                                                                className === undefined;
                                                            return isInline ? (
                                                                <code
                                                                    className={
                                                                        "text-xs sm:text-sm text-primary p-0.5 bg-foreground/5 rounded-sm"
                                                                    }
                                                                >
                                                                    {props.children}
                                                                </code>
                                                            ) : (
                                                                <div className="bg-foreground/10 rounded-md my-2">
                                                                    <div className="flex items-center justify-between p-2">
                                                                        <span className="text-xs font-medium text-muted-foreground capitalize tracking-wide">
                                                                            {language || "code"}
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 px-2"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                navigator.clipboard.writeText(
                                                                                    String(
                                                                                        props.children
                                                                                    )
                                                                                );
                                                                                toast.success(
                                                                                    "Code copié dans le presse-papiers"
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Copy
                                                                                size={12}
                                                                                className="mr-1"
                                                                            />
                                                                            <span className="text-xs">
                                                                                Copier
                                                                            </span>
                                                                        </Button>
                                                                    </div>
                                                                    <div className="overflow-x-auto">
                                                                        <SyntaxHighlighter
                                                                            language={language}
                                                                            style={
                                                                                customVscDarkPlus
                                                                            }
                                                                            className="antialiased text-sm tracking-wide [&_code]:!font-mono"
                                                                            customStyle={{
                                                                                fontFamily:
                                                                                    'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", Consolas, monospace !important',
                                                                                fontSize:
                                                                                    "0.875rem",
                                                                                lineHeight: "1.5",
                                                                                margin: 0,
                                                                                padding: "1rem",
                                                                                background:
                                                                                    "transparent",
                                                                            }}
                                                                            codeTagProps={{
                                                                                style: {
                                                                                    fontFamily:
                                                                                        'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", Consolas, monospace !important',
                                                                                },
                                                                            }}
                                                                            showLineNumbers={false}
                                                                            wrapLines={true}
                                                                            wrapLongLines={true}
                                                                        >
                                                                            {String(
                                                                                props.children
                                                                            ).replace(/\n$/, "")}
                                                                        </SyntaxHighlighter>
                                                                    </div>
                                                                </div>
                                                            );
                                                        },
                                                    }}
                                                >
                                                    {part.text}
                                                </MessageResponse>
                                            </MessageContent>
                                        </Message>
                                        {message.role === "assistant" && !isStreaming && (
                                            <MessageActions>
                                                <MessageAction
                                                    onClick={() => regenerate()}
                                                    tooltip="Regenerate"
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
                            case "file":
                                // Support pour les fichiers/images
                                if (part.mediaType?.startsWith("image/")) {
                                    return (
                                        <div key={`${message.id}-${i}`} className="my-2">
                                            <Image
                                                src={part.url}
                                                alt={part.filename || "Image"}
                                                className="max-w-md rounded-lg"
                                                width={600}
                                                height={400}
                                                loading="lazy"
                                            />
                                        </div>
                                    );
                                }
                                return null;
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
