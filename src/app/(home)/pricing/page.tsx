"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
    Check,
    X,
    Sparkles,
    Zap,
    Building2,
    MessageSquare,
    Image,
    Brain,
    Infinity,
    Headphones,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type BillingPeriod = "monthly" | "yearly";

interface PlanFeature {
    text: string;
    included: boolean;
    highlight?: boolean;
}

interface PricingPlan {
    name: string;
    description: string;
    monthlyPrice: number | null;
    yearlyPrice: number | null;
    icon: React.ReactNode;
    features: PlanFeature[];
    cta: string;
    ctaLink: string;
    popular?: boolean;
    enterprise?: boolean;
}

// Only two plans: Free (completely free) and Enterprise (contact us)
const plans: PricingPlan[] = [
    {
        name: "Free",
        description: "Completely free — ideal for individuals, students and early experimentation.",
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: <MessageSquare className="size-6" />,
        features: [
            { text: "Full access to standard models (Gemini / GPT-family)", included: true },
            { text: "Free, unlimited usage for core features", included: true },
            { text: "Limited access to advanced models (quota-based)", included: true },
            { text: "Basic chat history and export", included: true },
            { text: "Community support and docs", included: true },
            { text: "Image generation (very limited / trial)", included: false },
            { text: "Enterprise integrations", included: false },
            { text: "SLA / priority support", included: false },
        ],
        cta: "Start for Free",
        ctaLink: "/register",
    },
    {
        name: "Enterprise",
        description: "Custom solutions, integrations and on-prem or private deployments — contact our team to get a tailored quote.",
        monthlyPrice: null,
        yearlyPrice: null,
        icon: <Building2 className="size-6" />,
        features: [
            { text: "Everything in Free", included: true },
            { text: "Custom integration & API access", included: true, highlight: true },
            { text: "Advanced models & reasoning at scale", included: true, highlight: true },
            { text: "Unlimited image generation options", included: true, highlight: true },
            { text: "Dedicated account manager & SLA", included: true },
            { text: "Onboarding and custom fine-tuning", included: true },
            { text: "Data residency & privacy options", included: true },
            { text: "24/7 priority support", included: true },
        ],
        cta: "Contact Sales",
        ctaLink: "/support?subject=enterprise",
        enterprise: true,
    },
];

const faqs = [
    {
        question: "Can I switch plans at any time?",
        answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, the change takes effect at the end of your billing period.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept Mobile Money (MTN, Orange Money), bank transfers, and major credit/debit cards. All payments are processed securely.",
    },
    {
        question: "Is there a free trial for Premium?",
        answer: "While we don't offer a traditional free trial, our Free plan lets you explore the platform with limited access to advanced features. This way, you can experience the value before upgrading.",
    },
    {
        question: "What happens when I reach my message limit?",
        answer: "On the Free plan, you'll need to wait until the next day for your limit to reset, or upgrade to Premium for higher limits. We'll notify you when you're approaching your limit.",
    },
    {
        question: "How does Enterprise pricing work?",
        answer: "Enterprise plans are customized based on your organization's needs. Contact our sales team to discuss your requirements and get a personalized quote.",
    },
];

function formatPrice(price: number): string {
    return new Intl.NumberFormat("fr-CM", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function PricingPage() {
    // Only Free and Enterprise — clear choices for users in Cameroon and beyond
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-[1100px] mx-auto text-center">
                    <Badge variant="outline" className="px-4 py-2 text-sm rounded-full backdrop-blur-sm mb-6">
                        Affordable & transparent
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        One plan for everyone. One tailored for businesses.
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                        Use Niato AI completely free for personal use. For teams, integrations or projects,
                        our Enterprise offering gives you a dedicated contact, SLA and custom setup.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "px-8 h-12 rounded-full")}>
                            Start Free
                        </Link>
                        <Link href="/support?subject=enterprise" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8 h-12 rounded-full")}>
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* Two column plans */}
            <section className="px-4 pb-20">
                <div className="max-w-[1100px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((plan) => (
                            <Card key={plan.name} className={cn("flex flex-col p-6 h-full", plan.enterprise ? "border" : "border") }>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn("p-2.5 rounded-xl bg-muted text-muted-foreground")}>{plan.icon}</div>
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    </div>
                                    <CardDescription className="text-base">{plan.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="my-6">
                                        {plan.enterprise ? (
                                            <div className="text-3xl font-bold">Custom</div>
                                        ) : (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold">Free</span>
                                                <span className="text-muted-foreground">— always free</span>
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className={cn("flex items-start gap-3 text-sm", !feature.included && "text-muted-foreground") }>
                                                {feature.included ? (
                                                    <Check className={cn("size-5 shrink-0 mt-0.5", feature.highlight ? "text-primary" : "text-green-500")} />
                                                ) : (
                                                    <X className="size-5 shrink-0 mt-0.5 text-muted-foreground/50" />
                                                )}
                                                <span className={cn(feature.highlight && "font-medium")}>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="pt-4">
                                    <Link href={plan.ctaLink} className={cn(buttonVariants({ variant: plan.enterprise ? "outline" : "default", size: "lg" }), "w-full rounded-full text-base") }>
                                        {plan.cta}
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Short Features grid */}
            <section className="px-4 py-16 bg-muted/20">
                <div className="max-w-[1100px] mx-auto">
                    <h2 className="text-2xl font-bold mb-6">What you get with Free</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Standard AI Models</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Full access to core models for chat and productivity (no payment required).</CardDescription>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Education & Community</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Docs, examples and community support to help you get started.</CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ adapted to Cameroon / Free & Enterprise flow */}
            <section className="px-4 py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground">Answers about Free usage, limits and how to contact us for Enterprise work.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="faq-1">
                            <AccordionTrigger>Is Free really free?</AccordionTrigger>
                            <AccordionContent>
                                Yes — the Free plan is completely free to use for individuals, students and hobby projects. We offer core features and access to standard models without requiring payment details.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-2">
                            <AccordionTrigger>Can I use advanced models on Free?</AccordionTrigger>
                            <AccordionContent>
                                You have limited quota-based access to advanced models on Free. This lets you try advanced capabilities; for sustained high-volume use, contact us for Enterprise options.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-3">
                            <AccordionTrigger>How do I get Enterprise pricing?</AccordionTrigger>
                            <AccordionContent>
                                Enterprise pricing is custom — click "Contact Sales" to describe your project, expected volume, and any compliance or data residency needs. We will reply with a proposal and options (including local payment and invoicing options).
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-4">
                            <AccordionTrigger>What payment methods do you support for businesses?</AccordionTrigger>
                            <AccordionContent>
                                For Enterprise customers we support bank transfers, invoices, and major international cards. We can also discuss Mobile Money or local billing options for Cameroon (MTN, Orange) during contract negotiations.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-5">
                            <AccordionTrigger>How do you protect my data?</AccordionTrigger>
                            <AccordionContent>
                                We offer configurable data retention, encryption in transit and at rest, and optional private deployments for Enterprise customers. Tell us your requirements and we will include them in the proposal.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
