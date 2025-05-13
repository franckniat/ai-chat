"use client";

import { ThemeProvider } from "./theme-provider";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ProgressBar
                height="3px"
                color="var(--primary)"
                options={{ showSpinner: false }}
            />
            {children}
        </ThemeProvider>
    );
}
