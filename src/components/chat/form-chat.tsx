"use client";
import * as React from "react";
import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputButton,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputFooter,
    PromptInputTools,
    PromptInputHeader,
} from "@/components/ai-elements/prompt-input";
import {
    ModelSelector,
    ModelSelectorContent,
    ModelSelectorEmpty,
    ModelSelectorGroup,
    ModelSelectorInput,
    ModelSelectorItem,
    ModelSelectorList,
    ModelSelectorLogo,
    ModelSelectorLogoGroup,
    ModelSelectorName,
    ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "../ui/sidebar";
import { CheckIcon, GlobeIcon, Square, BrainIcon } from "lucide-react";
import { useChatContext } from "./chat-context";
import { Button } from "../ui/button";
import { models } from "./chat-provider";
import { Badge } from "../ui/badge";
import { personalities } from "@/lib/personalities";

interface FormChatProps {
    isLoading?: boolean;
    handleSubmit: (message: PromptInputMessage) => void;
    input?: string;
    handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    stop?: () => void;
    name?: string;
}

export default function FormChat({ input, handleInputChange, handleSubmit, isLoading, stop }: FormChatProps) {
    const { state, isMobile } = useSidebar();

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [open, setOpen] = React.useState(false);
    const chefs = Array.from(new Set(models.map((model) => model.chef)));
    const { useWebSearch, setUseWebSearch, selectedModel, setSelectedModel, selectedModelData, status, selectedPersonality, setSelectedPersonality } = useChatContext();

    const isStreaming = status === "streaming" || status === "submitted";

    const suggestionByPersonality: Record<string, string[]> = {
        default: [
            "Summarize the key points of this topic in 5 bullets",
            "Create a simple step-by-step action plan",
            "Explain this like I'm new to the subject",
        ],
        developer: [
            "Help me debug this issue step by step",
            "Refactor this code to be cleaner and safer",
            "Write a concise commit message for my changes",
        ],
        creative: [
            "Give me 5 original ideas for this project",
            "Rewrite this with a more vivid tone",
            "Brainstorm a catchy title and subtitle",
        ],
        tutor: [
            "Teach me this concept with a simple example",
            "Quiz me with 5 short questions",
            "Explain the difference between these two terms",
        ],
        analyst: [
            "Compare options with pros and cons",
            "Analyze risks and suggest mitigations",
            "Turn this into a decision matrix",
        ],
        translator: [
            "Translate this into French and keep the same tone",
            "Improve this text for clarity and natural flow",
            "Rewrite this for an international audience",
        ],
    };

    const quickSuggestions = suggestionByPersonality[selectedPersonality] || suggestionByPersonality.default;

    const handleSuggestionClick = React.useCallback((suggestion: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const setValue = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        setValue?.call(textarea, suggestion);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.focus();
    }, []);

    return (
        <div
            className={`fixed bottom-0 z-20 ${isMobile ? "left-0 w-full" : ""} ${state === "expanded" ? "w-[calc(100%-16rem)]" : "w-[calc(100%-3rem)]"} border-t bg-background/80 backdrop-blur-sm`}
        >
            <div
                className="mx-0 max-w-[760px] p-2 sm:mx-auto"
            >
                {!isStreaming && !input?.trim() && (
                    <Suggestions className="mb-2 px-1">
                        {quickSuggestions.map((suggestion) => (
                            <Suggestion
                                key={suggestion}
                                className="h-7 bg-background text-[11px]"
                                onClick={handleSuggestionClick}
                                suggestion={suggestion}
                            />
                        ))}
                    </Suggestions>
                )}
                <PromptInput onSubmit={handleSubmit} className="mt-2" globalDrop multiple>
                    <PromptInputHeader>
                        <PromptInputAttachments>
                            {(attachment) => <PromptInputAttachment data={attachment} />}
                        </PromptInputAttachments>
                    </PromptInputHeader>
                    <PromptInputBody>
                        <PromptInputTextarea
                            onChange={(e) => handleInputChange?.(e)}
                            ref={textareaRef}
                            value={input}
                            placeholder="Ask a question..."
                        />
                    </PromptInputBody>
                    <PromptInputFooter>
                        <PromptInputTools>
                            <PromptInputActionMenu>
                                <PromptInputActionMenuTrigger />
                                <PromptInputActionMenuContent>
                                    <PromptInputActionAddAttachments />
                                </PromptInputActionMenuContent>
                            </PromptInputActionMenu>
                            <PromptInputButton
                                onClick={() => setUseWebSearch(!useWebSearch)}
                                variant={useWebSearch ? "default" : "ghost"}
                            >
                                <GlobeIcon size={16} />
                                <span>Search</span>
                            </PromptInputButton>

                            {/* Personality Selector */}
                            <Select value={selectedPersonality} onValueChange={setSelectedPersonality}>
                                <SelectTrigger className="h-7 w-auto gap-1.5 border-none px-1.5 text-[11px] shadow-none hover:bg-accent">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {personalities.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            <span className="flex items-center gap-2">
                                                <span className="text-base leading-none">{p.icon}</span>
                                                <span>{p.name}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Model Selector */}
                            <ModelSelector onOpenChange={setOpen} open={open}>
                                <ModelSelectorTrigger asChild>
                                    <Button className="h-8 justify-between gap-2 px-2.5 text-xs" variant="outline">
                                        {selectedModelData?.chefSlug && (
                                            <ModelSelectorLogo
                                                provider={selectedModelData.chefSlug}
                                            />
                                        )}
                                        {selectedModelData?.name && (
                                            <ModelSelectorName>
                                                {selectedModelData.name}
                                            </ModelSelectorName>
                                        )}
                                        {selectedModelData?.isReasoning && (
                                            <BrainIcon className="size-3 text-purple-500" />
                                        )}
                                    </Button>
                                </ModelSelectorTrigger>
                                <ModelSelectorContent>
                                    <ModelSelectorInput placeholder="Search models..." />
                                    <ModelSelectorList>
                                        <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                                        {chefs.map((chef) => (
                                            <ModelSelectorGroup heading={chef} key={chef}>
                                                {models
                                                    .filter((model) => model.chef === chef)
                                                    .map((model) => (
                                                        <ModelSelectorItem
                                                            key={model.id}
                                                            onSelect={() => {
                                                                setSelectedModel(model.id);
                                                                setOpen(false);
                                                            }}
                                                            value={model.id}
                                                        >
                                                            <ModelSelectorLogo
                                                                provider={model.chefSlug}
                                                            />
                                                            <ModelSelectorName>
                                                                {model.name}
                                                            </ModelSelectorName>
                                                            {model.isReasoning && (
                                                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                                                    <BrainIcon className="size-3 mr-1" />
                                                                    Reasoning
                                                                </Badge>
                                                            )}
                                                            <ModelSelectorLogoGroup>
                                                                {model.providers.map((provider) => (
                                                                    <ModelSelectorLogo
                                                                        key={provider}
                                                                        provider={provider}
                                                                    />
                                                                ))}
                                                            </ModelSelectorLogoGroup>
                                                            {selectedModel === model.id ? (
                                                                <CheckIcon className="ml-auto size-4" />
                                                            ) : (
                                                                <div className="ml-auto size-4" />
                                                            )}
                                                        </ModelSelectorItem>
                                                    ))}
                                            </ModelSelectorGroup>
                                        ))}
                                    </ModelSelectorList>
                                </ModelSelectorContent>
                            </ModelSelector>
                        </PromptInputTools>

                        {/* Stop or Submit button */}
                        {isStreaming ? (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={stop}
                                className="h-8 gap-1 px-2 text-xs"
                            >
                                <Square className="size-3 fill-current" />
                                Stop
                            </Button>
                        ) : (
                            <PromptInputSubmit disabled={!input || isLoading} />
                        )}
                    </PromptInputFooter>
                </PromptInput>
                <p className="mt-2 text-center text-[8px] text-foreground/50 sm:text-[10px]">
                    Please verify the information provided by the AI, as it may sometimes be incorrect.
                </p>
            </div>
        </div>
    );
}

