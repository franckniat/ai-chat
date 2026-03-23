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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "../ui/sidebar";
import { CheckIcon, GlobeIcon, Square, BrainIcon, UserIcon } from "lucide-react";
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

    const currentPersonality = personalities.find((p) => p.id === selectedPersonality) || personalities[0];

    return (
        <div
            className={`fixed bottom-0 z-20 ${isMobile ? "w-full left-0" : ""} ${state === "expanded" ? "w-[calc(100%-16rem)]" : "w-[calc(100%-3rem)]"} bg-background/90 backdrop-blur-md`}
        >
            <div
                className="max-w-[800px] mx-0 sm:mx-auto sm:px-3 md:py-5 md:px-3"
            >
                <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
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
                                <SelectTrigger className="h-8 w-auto gap-1.5 border-none shadow-none text-xs px-2 hover:bg-accent">
                                    <span className="text-base leading-none">{currentPersonality.icon}</span>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {personalities.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            <span className="flex items-center gap-2">
                                                <span className="text-base leading-none">{p.icon}</span>
                                                <span>{p.name}</span>
                                                <span className="text-muted-foreground text-xs hidden sm:inline">— {p.description}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Model Selector */}
                            <ModelSelector onOpenChange={setOpen} open={open}>
                                <ModelSelectorTrigger asChild>
                                    <Button className="justify-between gap-2" variant="outline">
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
                                size="sm"
                                onClick={stop}
                                className="gap-1"
                            >
                                <Square className="size-3 fill-current" />
                                Stop
                            </Button>
                        ) : (
                            <PromptInputSubmit disabled={!input || isLoading} />
                        )}
                    </PromptInputFooter>
                </PromptInput>
                <p className="text-[8px] sm:text-xs text-center mt-3 text-foreground/50">
                    Please verify the information provided by the AI, as it may sometimes be incorrect.
                </p>
            </div>
        </div>
    );
}

