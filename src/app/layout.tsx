import type { Metadata } from 'next'
import { DM_Sans, Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const geist = Geist({
    variable: '--font-geist',
    subsets: ['latin'],
})

const dmSans = DM_Sans({
    variable: '--font-dm-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'niato chat',
    description:
        'niato chat is a smart messaging app powered by multiple AI models. Get instant, accurate, and personalized responses. Choose the AI model that fits your needs.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geist.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-mono tracking-[0.03rem] text-pretty antialiased`}
            >
                <Providers>{children}</Providers>
                <Analytics />
            </body>
        </html>
    )
}
