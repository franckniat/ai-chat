"use client";

import { ThemeProvider } from "./theme-provider";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ProgressBar
                height="3px"
                color="#737373"
                options={{ showSpinner: false }}
            />
            {children}
        </ThemeProvider>
    );
}
