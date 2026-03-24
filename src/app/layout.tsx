import type { Metadata } from 'next'
import { Geist_Mono, Geist, Public_Sans } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'
import 'katex/dist/katex.min.css'
import { Analytics } from '@vercel/analytics/next'

const geist = Geist({
    variable: '--font-manrope',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const publicSans = Public_Sans({
    variable: '--font-public-sans',
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
                className={`${geist.variable} ${geistMono.variable} ${publicSans.variable} font-sans  text-pretty antialiased`}
            >
                <Providers>{children}</Providers>
                <Analytics />
            </body>
        </html>
    )
}
