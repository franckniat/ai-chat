
import { Badge } from '@/components/ui/badge'
import {  buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Bot, Zap, Shield, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import FeatureCard from '@/components/ui/FeatureCard'
import FaqItem from '@/components/ui/FaqItem'
import { TestimonialCard } from '@/components/ui/TestimonialCard'

/**
 * ==============================================================================
 * HOME PAGE COMPONENT
 * ==============================================================================
 * This is the main landing page for the application.
 * It is divided into several logical sections:
 * 1. Hero: Main value proposition and CTA.
 * 2. Features: Grid of key capabilities.
 * 3. Testimonials: Social proof.
 * 4. FAQ: Common questions.
 * 5. CTA: Final call to action.
 * ==============================================================================
 */
export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 
              -----------------------------------------------------------------------
              HERO SECTION
              -----------------------------------------------------------------------
              The entry point of the page. Uses a large typography and a gradient 
              effect on the text to grab attention. Includes a "New Feature" badge 
              and primary action buttons.
            */}
            <section className="px-4 py-10 md:py-20 lg:py-32">
                <div className="max-w-[1280px] mx-auto px-4 text-center">
                    <div className="flex flex-col items-center gap-6">
                        {/* New Feature Announcement Badge */}
                        <Link href="/chat?model=gpt-4o-mini&source=home">
                            <Badge
                                variant="outline"
                                className="px-4 py-2 text-sm rounded-full backdrop-blur-sm"
                            >
                                <span className="mr-2">🚀</span>
                                New: Chat with GPT-4.1 for free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Badge>
                        </Link>

                        {/* Main Headline with Gradient Effect */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight font-mono">
                            Unlock the power of <br className="hidden md:block" />
                            <span className="text-primary relative inline-block mt-2">
                                AI Intelligence
                                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full opacity-50" />
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Experience the next generation of AI chat. Seamlessly switch between
                            models, analyze documents, and boost your productivity with Niato AI.
                        </p>

                        {/* Primary Call to Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
                            <Link
                                href="/chat"
                                className={cn(
                                    buttonVariants({ size: "lg" }),
                                    "w-full sm:w-auto px-8 text-lg h-12 rounded-full shadow-lg hover:shadow-primary/25 transition-all"
                                )}
                            >
                                Start Chatting
                                <MessageSquare className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/pricing"
                                className={cn(
                                    buttonVariants({ variant: "outline", size: "lg" }),
                                    "w-full sm:w-auto px-8 text-lg h-12 rounded-full"
                                )}
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 
              -----------------------------------------------------------------------
              FEATURES SECTION
              -----------------------------------------------------------------------
              Highlights the core benefits of the application using a grid layout.
              Each feature is represented by a card with an icon.
            */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why choose Niato AI?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Built for developers, creators, and professionals who need reliable AI
                            assistance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Bot className="h-10 w-10 text-primary" />}
                            title="Multi-Model Support"
                            description="Access GPT-4, Claude 3, and Gemini Pro all in one unified interface."
                        />
                        <FeatureCard
                            icon={<Zap className="h-10 w-10 text-primary" />}
                            title="Lightning Fast"
                            description="Optimized for speed with streaming responses and low latency edge computing."
                        />
                        <FeatureCard
                            icon={<Shield className="h-10 w-10 text-primary" />}
                            title="Secure & Private"
                            description="Your data is encrypted. We prioritize your privacy and data security."
                        />
                        <FeatureCard
                            icon={<Sparkles className="h-10 w-10 text-primary" />}
                            title="Smart Context"
                            description="Advanced context management allows for longer, more coherent conversations."
                        />
                        <FeatureCard
                            icon={<MessageSquare className="h-10 w-10 text-primary" />}
                            title="Chat History"
                            description="Save, organize, and search through your past conversations effortlessly."
                        />
                        <FeatureCard
                            icon={<CheckCircle2 className="h-10 w-10 text-primary" />}
                            title="Code Highlighting"
                            description="Beautiful syntax highlighting for over 100 programming languages."
                        />
                    </div>
                </div>
            </section>

            {/* 
              -----------------------------------------------------------------------
              TESTIMONIALS SECTION
              -----------------------------------------------------------------------
              Displays user feedback to build trust. Uses a 3-column grid layout.
            */}
            <section className="py-20">
                <div className="max-w-[1280px] mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Loved by thousands
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sarah Chen"
                            role="Software Engineer"
                            content="Niato AI has completely transformed my workflow. The code generation is spot on and the multi-model support is a game changer."
                            initials="SC"
                        />
                        <TestimonialCard
                            name="Alex Rivera"
                            role="Content Creator"
                            content="I use it daily for brainstorming and drafting. The interface is so clean and the responses are incredibly fast."
                            initials="AR"
                        />
                        <TestimonialCard
                            name="Jordan Smith"
                            role="Product Manager"
                            content="The best AI wrapper I've used. It's simple, powerful, and the pricing is very reasonable for the value you get."
                            initials="JS"
                        />
                    </div>
                </div>
            </section>

            {/* 
              -----------------------------------------------------------------------
              FAQ SECTION
              -----------------------------------------------------------------------
              Addresses common user questions.
            */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-[800px] mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        <FaqItem
                            question="Is there a free plan?"
                            answer="Yes! You can use our basic models for free forever. Upgrade only when you need access to premium models like GPT-4."
                        />
                        <FaqItem
                            question="How does the credit system work?"
                            answer="We use a simple pay-as-you-go system for premium models. You only pay for what you use, with no hidden monthly fees."
                        />
                        <FaqItem
                            question="Can I cancel anytime?"
                            answer="Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your dashboard."
                        />
                    </div>
                </div>
            </section>

            {/* 
              -----------------------------------------------------------------------
              CTA SECTION
              -----------------------------------------------------------------------
              Final push to convert the visitor. Uses a distinct background style.
            */}
            <section className="py-20 px-6">
                <div className="max-w-[1000px] mx-auto bg-primary/5 rounded-3xl p-8 md:p-16 text-center border border-primary/10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to supercharge your productivity?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already using Niato AI to work smarter, not
                        harder.
                    </p>
                    <Link
                        href="/chat"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "w-full sm:w-auto px-8 text-lg h-12 rounded-full shadow-lg hover:shadow-primary/25 transition-all"
                        )}
                    >
                        Get Started for Free
                    </Link>
                </div>
            </section>
        </div>
    );
}
