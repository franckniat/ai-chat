import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    ArrowRight,
    Bot,
    History,
    Keyboard,
    MessageSquare,
    Repeat2,
    ShieldCheck,
    Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import FeatureCard from '@/components/ui/FeatureCard'
import FaqItem from '@/components/ui/FaqItem'
import { MagicCard } from '@/components/ui/magic-card'
import { GOOGLE_MODELS } from '@/lib/google-models'
import { personalities } from '@/lib/personalities'

export const metadata: Metadata = {
    title: 'niato ai | Free multi-model AI chat',
    description:
        'niato ai puts several Google Gemini models behind one chat window: streaming replies, a searchable history, and automatic failover when a model is busy. Free to use.',
    keywords: ['niato ai', 'ai chat', 'gemini', 'google ai', 'free ai assistant'],
    alternates: {
        canonical: '/',
    },
}

/**
 * Landing page.
 *
 * The copy describes only what the application actually does (see
 * lib/google-models.ts, lib/personalities.ts and the /api/chat route).
 * Features that exist in the UI but are not wired server-side — web search,
 * file attachments — are deliberately not advertised.
 */
export default function HomePage() {
    const showcasedModels = GOOGLE_MODELS

    return (
        <div className="flex flex-col">
            {/* ---------------------------------------------------------------
                HERO
            --------------------------------------------------------------- */}
            <section className="px-4 py-16 md:py-24 lg:py-32">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="flex flex-col items-center gap-6">
                        <Link href="/chat" className="max-w-full">
                            <Badge
                                variant="outline"
                                className="max-w-full whitespace-normal rounded-full px-4 py-2 text-center text-xs backdrop-blur-sm sm:text-sm"
                            >
                                <span className="mr-2">✨</span>
                                {showcasedModels.length} models, free to use, no credit card
                                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                            </Badge>
                        </Link>

                        <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                            Many models.
                            <br className="hidden md:block" />{' '}
                            <span className="text-primary relative mt-2 inline-block">
                                One window.
                                <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r opacity-50" />
                            </span>
                        </h1>

                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
                            Ask a question, switch models mid-conversation, and find any thread
                            again later. When a model is rate-limited, niato ai moves to the next
                            one instead of failing on you.
                        </p>

                        <div className="mt-4 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                            <Link
                                href="/chat"
                                className={cn(
                                    buttonVariants({ size: 'lg' }),
                                    'hover:shadow-primary/25 h-12 w-full rounded-full px-8 text-lg shadow-lg transition-all sm:w-auto',
                                )}
                            >
                                Open the chat
                                <MessageSquare className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/pricing"
                                className={cn(
                                    buttonVariants({ variant: 'outline', size: 'lg' }),
                                    'h-12 w-full rounded-full px-8 text-lg sm:w-auto',
                                )}
                            >
                                View plans
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------
                FEATURES
            --------------------------------------------------------------- */}
            <section className="bg-muted/30 py-20">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            What niato ai does
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            A plain chat interface built around open models you can use for free.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<Bot className="text-primary h-10 w-10" />}
                            title="Several models"
                            description={`${showcasedModels.length} Google Gemini models, sorted from the most economical to the most capable. Switch between them at any point, even mid-conversation.`}
                        />
                        <FeatureCard
                            icon={<Repeat2 className="text-primary h-10 w-10" />}
                            title="Automatic failover"
                            description="When a free model hits its rate limit, the reply restarts on the next model in the list instead of returning an error."
                        />
                        <FeatureCard
                            icon={<History className="text-primary h-10 w-10" />}
                            title="Searchable history"
                            description="Conversations are saved, grouped by date, and searchable by title or by the content of their messages."
                        />
                        <FeatureCard
                            icon={<Sparkles className="text-primary h-10 w-10" />}
                            title={`${personalities.length} tones`}
                            description="A selector changes how the assistant answers, from steady and factual to playful, without rewriting your instructions each time."
                        />
                        <FeatureCard
                            icon={<Keyboard className="text-primary h-10 w-10" />}
                            title="Code and formulas"
                            description="Syntax highlighting, LaTeX math and Markdown tables are rendered directly inside the answers."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="text-primary h-10 w-10" />}
                            title="Protected account"
                            description="Sign in by email with verification, or through Google and GitHub. Your conversations are readable only from your own account."
                        />
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------
                AVAILABLE MODELS
                Replaces the former testimonials section, whose three reviews
                were invented. This list is generated from lib/free-models.ts,
                so it stays accurate by construction.
            --------------------------------------------------------------- */}
            <section className="py-20">
                <div className="mx-auto max-w-[1280px] px-6">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Available models</h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            All reachable as soon as your account exists, at no cost to you.
                        </p>
                    </div>

                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {showcasedModels.map((model) => (
                            <li
                                key={model.id}
                                className="bg-card flex items-center justify-between gap-4 rounded-xl border p-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{model.name}</p>
                                    <p className="text-muted-foreground truncate text-sm">
                                        {model.chef}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="shrink-0 text-xs">
                                    {model.category}
                                </Badge>
                            </li>
                        ))}
                    </ul>

                    <p className="text-muted-foreground mt-6 text-center text-sm">
                        Sorted from the most economical to the most capable. The cheapest one is
                        selected by default.
                    </p>
                </div>
            </section>

            {/* ---------------------------------------------------------------
                FAQ
            --------------------------------------------------------------- */}
            <section className="bg-muted/30 py-20">
                <div className="mx-auto max-w-[800px] px-6">
                    <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
                        Frequently asked questions
                    </h2>
                    <div className="space-y-4">
                        <FaqItem
                            question="Is it really free?"
                            answer="Yes, for you. There is no card to enter and no trial countdown. Model usage is paid for by the project, which is why the catalogue favours efficient models. The Enterprise plan exists for organisations that need a contract, not to unlock features."
                        />
                        <FaqItem
                            question="What happens when a model is rate-limited?"
                            answer="Models have throughput limits set by their provider. When one is reached, niato ai restarts the reply on the next model in the list and tells you it switched."
                        />
                        <FaqItem
                            question="Are my conversations kept?"
                            answer="Yes, they are saved to your account so you can find and search them later. You can delete any conversation from the sidebar at any time."
                        />
                        <FaqItem
                            question="Can I change model mid-conversation?"
                            answer="Yes. The model selector sits under the composer, and the change applies to your next message without clearing the history."
                        />
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------
                CTA
            --------------------------------------------------------------- */}
            <section className="px-6 py-20">
                <MagicCard className="bg-primary/5 border-primary/10 mx-auto max-w-[1000px] rounded-3xl border p-8 text-center md:p-16">
                    <h2 className="mb-6 text-3xl font-bold md:text-5xl">
                        Try it — there is nothing to pay
                    </h2>
                    <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                        Create an account in a few seconds and start your first conversation.
                    </p>
                    <Link
                        href="/chat"
                        className={cn(
                            buttonVariants({ size: 'lg' }),
                            'hover:shadow-primary/25 h-12 w-full rounded-full px-8 text-lg shadow-lg transition-all sm:w-auto',
                        )}
                    >
                        Get started
                    </Link>
                </MagicCard>
            </section>
        </div>
    )
}
