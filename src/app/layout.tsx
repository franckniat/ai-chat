import type { Metadata } from 'next'
import { Geist_Mono, JetBrains_Mono, Public_Sans } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { LocaleProvider } from '@/components/locale-provider'

const publicSans = Public_Sans({
    variable: '--font-public-sans',
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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const messages = await getMessages();

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={` ${publicSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-sans tracking-[0.05rem] text-pretty antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <LocaleProvider>
                        <Providers>{children}</Providers>
                    </LocaleProvider>
                </NextIntlClientProvider>
                <Analytics />
            </body>
        </html>
    )
}
