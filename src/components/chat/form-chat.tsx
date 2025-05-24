"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, CircleStop } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { Textarea } from "../ui/textarea";

interface FormChatProps {
    isLoading?: boolean;
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    input?: string;
    handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    stop?: () => void;
    name?: string;
}

export default function FormChat({
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    name,
}: FormChatProps) {
    const { state, isMobile } = useSidebar();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            const val = input || "";
            const selectionStart = e.currentTarget.selectionStart || 0;
            const selectionEnd = e.currentTarget.selectionEnd || 0;
            const before = val.slice(0, selectionStart);
            const after = val.slice(selectionEnd) || "";
            const newValue = `${before}\n${after}`;
            handleInputChange?.({
                target: { value: newValue },
            } as React.ChangeEvent<HTMLTextAreaElement>);
        } else if (e.key === "Enter") {
            if (!input?.trim()) {
                return;
            }
            e.preventDefault();
            handleSubmit?.({} as React.FormEvent<HTMLFormElement>);
        }
    };

    return (
        <div
            className={`fixed bottom-0 z-20 ${isMobile ? "w-full left-0" : ""} ${state === "expanded" ? "w-[calc(100%-16rem)]" : "w-[calc(100%-3rem)]"} bg-background/90 backdrop-blur-md`}
        >
            <div className="max-w-[800px] mx-0 sm:mx-auto py-3 sm:px-3
            md:py-5 md:px-3">
                <form
                    className="flex items-center gap-2 relative"
                    onSubmit={handleSubmit}
                >
                    <Textarea
                        name={name}
                        className="w-full placeholder:text-sm md:placeholder:text-base resize-none overflow-y-auto placeholder:text-foreground/50 pr-12 mx-1"
                        placeholder="Envoyer un message"
                        value={input}
                        disabled={isLoading}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        style={{
                            height: "auto",
                            maxHeight: isMobile ? "100px" : "150px",
                        }}
                    />
                    {isLoading ? (
                        <Button 
                            variant="outline"
                            className="absolute right-2 bottom-2"
                            onClick={stop}
                        >
                            <CircleStop size={20} />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isLoading || !input}
                            className="absolute right-2 bottom-2"
                        >
                            <ArrowUp size={20} />
                        </Button>
                    )}
                </form>
                <p className="text-[8px] sm:text-xs text-center mt-3 text-foreground/50">
                    Pensez à vérifier les informations que l&#039;IA vous donne, il peut
                    arriver qu&#039;elle se trompe.
                </p>
            </div>
        </div>
    );
}
