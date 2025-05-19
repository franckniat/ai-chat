"use client"
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp, ImagePlus, Paperclip } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { Textarea } from '../ui/textarea';

interface FormChatProps {
    isLoading?: boolean;
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    input?: string;
    handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function FormChat({isLoading, input, handleInputChange, handleSubmit}:FormChatProps) {
    const {state} = useSidebar();
    return (
        <div className={`fixed bottom-0 ${state === "expanded" ? "w-[calc(100%-16rem)]" : "w-[calc(100%-3rem)]"}`}>
            <div className="max-w-[800px] mx-auto py-3 sm:py-5 md:py-8 px-3 bg-background/90 backdrop-blur-md">
                <form className="flex items-center gap-2 relative" onSubmit={handleSubmit}>
                    <Textarea
                        className="w-full resize-none overflow-y-auto placeholder:text-foreground/50 pr-12"
                        placeholder="Envoyer un message"
                        value={input}
                        disabled={isLoading}
                        onChange={handleInputChange}
                        autoFocus
                        style={{
                            height: 'auto',
                            maxHeight: '200px',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                    />
                    <div className="flex items-center gap-2 absolute -top-12 left-1/2 -translate-x-1/2">
                        <Button type="button" variant="outline"><ImagePlus size={20} />Upload image</Button>
                        <Button type="button" variant="outline"><Paperclip size={20} />Upload file</Button>
                    </div>
                    <Button type="submit" disabled={isLoading} className="absolute right-2 bottom-2"><ArrowUp size={20} /></Button>
                </form>
                <p className='text-xs text-center mt-3 text-foreground/50'>
                    Pensez à vérifier les informations que l&#039;IA vous donne, il peut arriver qu&#039;elle se trompe.
                </p>
            </div>
        </div>
    )
}