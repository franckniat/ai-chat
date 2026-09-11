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
import { CheckIcon, GlobeIcon, ListChecks, Square, BrainIcon } from "lucide-react";
import { useChatContext } from "./chat-context";
import { Button } from "../ui/button";
import { models } from "./chat-provider";
import { Badge } from "../ui/badge";
import { getPersonalityById, personalities } from "@/lib/personalities";
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
    const categories: ModelCategory[] = ["Budget", "Balanced", "Advanced"];
    const { useWebSearch, setUseWebSearch, selectedModel, setSelectedModel, selectedModelData, status, selectedPersonality, setSelectedPersonality, clarifyMode, setClarifyMode, isClarifying } = useChatContext();

    const isStreaming = status === "streaming" || status === "submitted";

    // Les amorces viennent de la personnalite elle-meme : plus de table
    // parallele a garder synchronisee.
    const quickSuggestions = getPersonalityById(selectedPersonality).suggestions;

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
                    // Doit rester aligne sur SUPPORTED_ATTACHMENT_TYPES dans la
                    // route : tout autre type y serait ignore en silence.
                    accept="image/png,image/jpeg,image/webp,image/heic,image/heif,application/pdf"
                    maxFileSize={10 * 1024 * 1024}
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

                            {/* Mode « questions d'abord » : l'IA clarifie la
                                demande avant de repondre. */}
                            <PromptInputButton
                                onClick={() => setClarifyMode(!clarifyMode)}
                                variant={clarifyMode ? "default" : "ghost"}
                                disabled={isClarifying}
                                className="h-8 rounded-full px-2.5 text-xs"
                                title="Let the assistant ask a few questions before answering"
                            >
                                <ListChecks size={15} />
                                <span>{isClarifying ? "Thinking…" : "Ask first"}</span>
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
                                                            {/* Le classement est desormais un
                                                                classement de cout : 1 = le moins
                                                                cher a l'usage. */}
                                                            <Badge variant="outline" className="text-xs px-1 py-0">
                                                                Cost #{model.costRank}
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

