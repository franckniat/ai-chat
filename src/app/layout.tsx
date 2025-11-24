import type { Metadata } from 'next'
import { Geist_Mono, JetBrains_Mono, Instrument_Sans } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

const instrumentSans = Instrument_Sans({
    variable: '--font-instrument-sans',
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
                className={` ${instrumentSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-sans tracking-[0.05rem] text-pretty antialiased`}
            >
                <Providers>{children}</Providers>
                <Analytics />
            </body>
        </html>
    )
}
