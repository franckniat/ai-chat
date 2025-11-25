"use client";
import * as React from "react";
import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    //PromptInputAttachment,
    //PromptInputAttachments,
    PromptInputBody,
    //PromptInputButton,
    type PromptInputMessage,
    //PromptInputSelect,
    //PromptInputSelectContent,
    //PromptInputSelectItem,
    //PromptInputSelectTrigger,
    //PromptInputSelectValue,
    //PromptInputSpeechButton,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputFooter,
    PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useSidebar } from "../ui/sidebar";

interface FormChatProps {
    isLoading?: boolean;
    handleSubmit: (message: PromptInputMessage) => void;
    input?: string;
    handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    stop?: () => void;
    name?: string;
}

export default function FormChat({
    input,
    handleInputChange,
    handleSubmit,
}: FormChatProps) {
    const { state, isMobile } = useSidebar();

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    return (
        <div
            className={`fixed bottom-0 z-20 ${isMobile ? "w-full left-0" : ""} ${state === "expanded" ? "w-[calc(100%-16rem)]" : "w-[calc(100%-3rem)]"} bg-background/90 backdrop-blur-md`}
        >
            <div
                className="max-w-[800px] mx-0 sm:mx-auto sm:px-3
            md:py-5 md:px-3"
            >
                <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
                    {/* <PromptInputHeader>
                        <PromptInputAttachments>
                            {(attachment) => <PromptInputAttachment data={attachment} />}
                        </PromptInputAttachments>
                    </PromptInputHeader> */}
                    <PromptInputBody>
                        <PromptInputTextarea
                            onChange={(e) => handleInputChange?.(e)}
                            ref={textareaRef}
                            value={input}
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
                            {/* <PromptInputButton
                                onClick={() => setUseWebSearch(!useWebSearch)}
                                variant={useWebSearch ? "default" : "ghost"}
                            >
                                <GlobeIcon size={16} />
                                <span>Search</span>
                            </PromptInputButton> */}
                            {/* <PromptInputSelect
                                onValueChange={(value) => {
                                    setModel(value);
                                }}
                                value={model}
                            >
                                <PromptInputSelectTrigger>
                                    <PromptInputSelectValue />
                                </PromptInputSelectTrigger>
                                <PromptInputSelectContent>
                                    {models.map((model) => (
                                        <PromptInputSelectItem key={model.id} value={model.id}>
                                            {model.name}
                                        </PromptInputSelectItem>
                                    ))}
                                </PromptInputSelectContent>
                            </PromptInputSelect> */}
                        </PromptInputTools>
                        <PromptInputSubmit disabled={!input}  />
                    </PromptInputFooter>
                </PromptInput>
                <p className="text-[8px] sm:text-xs text-center mt-3 text-foreground/50">
                    Please verify the information provided by the AI, as it may sometimes be incorrect.
                </p>
            </div>
        </div>
    );
}
