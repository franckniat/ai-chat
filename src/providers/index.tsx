"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";
import { ProgressProvider } from '@bprogress/next/app';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
                <Toaster richColors closeButton />
                <ProgressProvider
                    height="3px"
                    color="#525252"
                    options={{ showSpinner: false }}
                    shallowRouting
                >
                    {children}
                </ProgressProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}
