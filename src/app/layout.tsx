import type { Metadata } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'
import 'katex/dist/katex.min.css'
import { Analytics } from '@vercel/analytics/next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://niato.ai'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
})

const jetBrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'niato ai | Multi-model AI chat platform',
        template: '%s | niato ai',
    },
    applicationName: 'niato ai',
    description:
        'niato ai is a multi-model AI chat platform for faster work, better reasoning, document analysis, and creative workflows.',
    keywords: [
        'niato ai',
        'niato chat',
        'ai chat',
        'ai assistant',
        'multi-model ai',
        'deepseek',
        'llama',
        'qwen',
    ],
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName: 'niato ai',
        title: 'niato ai | Multi-model AI chat platform',
        description:
            'Use niato ai to chat across top AI models with fast, reliable, and personalized responses.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'niato ai | Multi-model AI chat platform',
        description:
            'niato ai helps you work with leading AI models in one clean interface.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'niato ai',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: siteUrl,
        description:
            'niato ai is a multi-model AI chat application built for productivity, creation, and development workflows.',
        brand: {
            '@type': 'Brand',
            name: 'niato ai',
        },
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${spaceGrotesk.className} ${jetBrainsMono.variable} text-pretty antialiased`}
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <Providers>{children}</Providers>
                <Analytics />
            </body>
        </html>
    )
}
