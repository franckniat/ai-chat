"use client"
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { Textarea } from '../ui/textarea';

interface FormChatProps {
    isLoading?: boolean;
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    input?: string;
    handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function FormChat({ isLoading, input, handleInputChange, handleSubmit }: FormChatProps) {
    const { state } = useSidebar();
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            const val = input || '';
            const selectionStart = e.currentTarget.selectionStart || 0;
            const selectionEnd = e.currentTarget.selectionEnd || 0;
            const before = val.slice(0, selectionStart);
            const after  = val.slice(selectionEnd) || '';
            const newValue = `${before}\n${after}`;
            handleInputChange?.({target: {value: newValue}} as React.ChangeEvent<HTMLTextAreaElement>);
        } else if(e.key === 'Enter') {
            if(!input?.trim()) {
                return;
            }
            e.preventDefault();
            handleSubmit?.({} as React.FormEvent<HTMLFormElement>);
        }
    }
    
    return (
        <div className={`fixed bottom-0 ${state === "expanded" ? "w-[calc(100%-16rem)]" : "w-[calc(100%-3rem)]"}`}>
            <div className="max-w-[1000px] mx-auto py-3 sm:py-5 md:py-8 px-3 bg-background/90 backdrop-blur-md">
                <form className="flex items-center gap-2 relative" onSubmit={handleSubmit}>
                    <Textarea
                        className="w-full resize-none overflow-y-auto placeholder:text-foreground/50 pr-12"
                        placeholder="Envoyer un message"
                        value={input}
                        disabled={isLoading}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        style={{
                            height: 'auto',
                            maxHeight: '200px',
                        }}
                    />
                    <Button type="submit" disabled={isLoading || !input} className="absolute right-2 bottom-2">
                        <ArrowUp size={20} />
                    </Button>
                </form>
                <p className='text-xs text-center mt-3 text-foreground/50'>
                    Pensez à vérifier les informations que l&#039;IA vous donne, il peut arriver qu&#039;elle se trompe.
                </p>
            </div>
        </div>
    )
}