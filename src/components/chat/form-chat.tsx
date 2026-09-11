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
import { CheckIcon, GlobeIcon, Square, BrainIcon } from "lucide-react";
import { useChatContext } from "./chat-context";
import { Button } from "../ui/button";
import { models } from "./chat-provider";
import { Badge } from "../ui/badge";
import { personalities } from "@/lib/personalities";
import type { ModelCategory } from "@/lib/google-models";

interface FormChatProps {
    isLoading?: boolean;
    handleSubmit: (message: PromptInputMessage) => void;
    input?: string;
    handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    stop?: () => void;
    name?: string;
}

export default function FormChat({ input, handleInputChange, handleSubmit, isLoading, stop }: FormChatProps) {

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [open, setOpen] = React.useState(false);
    const categories: ModelCategory[] = ["Elite", "Solide", "Leger"];
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
        // Plus de `position: fixed` ni de largeur calculee a la main
        // (`w-[calc(100%-16rem)]`, qui supposait la largeur exacte de la
        // sidebar) : le composeur est un enfant du flex vertical de la page.
        <div className="bg-background shrink-0">
            <div className="mx-auto w-full max-w-3xl px-4 pb-3">
                {/* `w-full flex-wrap` neutralise le `w-max flex-nowrap` par defaut
                    de Suggestions : il place les puces dans un ScrollArea
                    horizontal a barre masquee, donc la derniere etait coupee sans
                    aucun indice qu'on pouvait defiler. */}
                {!isStreaming && !input?.trim() && (
                    <Suggestions className="mb-2 w-full flex-wrap">
                        {quickSuggestions.map((suggestion) => (
                            <Suggestion
                                key={suggestion}
                                className="text-muted-foreground hover:text-foreground h-7 rounded-full border-border/60 bg-transparent text-xs"
                                onClick={handleSuggestionClick}
                                suggestion={suggestion}
                            />
                        ))}
                    </Suggestions>
                )}
                <PromptInput
                    onSubmit={handleSubmit}
                    className="rounded-3xl border-border/70 shadow-sm transition-shadow focus-within:border-border focus-within:shadow-md"
                    globalDrop
                    multiple
                >
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
                            className="min-h-[52px] px-4 py-3.5 text-[15px] leading-relaxed"
                            placeholder="Ask anything..."
                        />
                    </PromptInputBody>
                    <PromptInputFooter className="px-2 pb-2">
                        <PromptInputTools className="gap-0.5">
                            <PromptInputActionMenu>
                                <PromptInputActionMenuTrigger />
                                <PromptInputActionMenuContent>
                                    <PromptInputActionAddAttachments />
                                </PromptInputActionMenuContent>
                            </PromptInputActionMenu>
                            <PromptInputButton
                                onClick={() => setUseWebSearch(!useWebSearch)}
                                variant={useWebSearch ? "default" : "ghost"}
                                className="h-8 rounded-full px-2.5 text-xs"
                            >
                                <GlobeIcon size={15} />
                                <span>Search</span>
                            </PromptInputButton>

                            {/* Personality Selector */}
                            <Select value={selectedPersonality} onValueChange={setSelectedPersonality}>
                                <SelectTrigger className="hover:bg-accent h-8 w-auto gap-1.5 rounded-full border-none px-2.5 text-xs shadow-none">
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
                                    <Button
                                        className="h-8 justify-between gap-1.5 rounded-full border-none px-2.5 text-xs shadow-none"
                                        variant="ghost"
                                    >
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
                                        {categories.map((category) => (
                                            <ModelSelectorGroup heading={category} key={category}>
                                                {models
                                                    .filter((model) => model.category === category)
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
                                                            <Badge variant="outline" className="text-xs px-1 py-0">
                                                                Pop #{model.popularityRank} · Perf #{model.performanceRank}
                                                            </Badge>
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

                        {/* Bouton rond unique, qui bascule envoi <-> arret,
                            comme dans les composeurs de Claude et ChatGPT. */}
                        {isStreaming ? (
                            <Button
                                type="button"
                                size="icon"
                                onClick={stop}
                                className="size-8 shrink-0 rounded-full"
                                aria-label="Stop generating"
                            >
                                <Square className="size-3 fill-current" />
                            </Button>
                        ) : (
                            <PromptInputSubmit
                                className="size-8 shrink-0 rounded-full"
                                disabled={!input?.trim() || isLoading}
                            />
                        )}
                    </PromptInputFooter>
                </PromptInput>
                <p className="text-muted-foreground/70 mt-2 text-center text-xs">
                    Please verify the information provided by the AI, as it may sometimes be incorrect.
                </p>
            </div>
        </div>
    );
}

