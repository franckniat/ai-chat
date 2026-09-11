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
        // Aligne sur lib/free-models.ts et sur ce que la route /api/chat fait
        // reellement. L'ancienne liste citait DeepSeek / Llama / Qwen — absents
        // de l'application — et de la generation d'images, qui n'existe pas.
        features: [
            { text: "Every model in the catalogue, none held back", included: true },
            { text: "Automatic failover when a model is rate-limited", included: true },
            { text: "Searchable conversation history", included: true },
            { text: "Selectable answer tones", included: true },
            { text: "Code highlighting and LaTeX math", included: true },
            { text: "Community support via the contact form", included: true },
            { text: "Contractual guarantees and SLA", included: false },
            { text: "Private or on-premise deployment", included: false },
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
            { text: "Private or on-premise deployment", included: true, highlight: true },
            { text: "Paid model tiers on your own provider account", included: true, highlight: true },
            { text: "Data residency options", included: true, highlight: true },
            { text: "Named contact and agreed response times", included: true },
            { text: "Onboarding support", included: true },
            { text: "Invoicing and local payment options", included: true },
        ],
        cta: "Contact Sales",
        ctaLink: "/support?subject=enterprise",
        enterprise: true,
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
                        <p className="text-muted-foreground">What the free plan covers, how model limits behave, and when Enterprise is worth a conversation.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="faq-1">
                            <AccordionTrigger>Is Free really free?</AccordionTrigger>
                            <AccordionContent>
                                Yes. No card to enter, no trial countdown, and no feature held back behind a paywall. The models in the catalogue are free models, so running them costs nothing.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-2">
                            <AccordionTrigger>Are there usage limits?</AccordionTrigger>
                            <AccordionContent>
                                niato ai does not meter your messages. The models themselves have throughput limits set by their providers, shared across all users; when one is reached, the app restarts your reply on the next model instead of failing.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-3">
                            <AccordionTrigger>How do I get Enterprise pricing?</AccordionTrigger>
                            <AccordionContent>
                                Enterprise is not a feature tier — it is a contract. Click &ldquo;Contact Sales&rdquo; to describe your deployment, expected volume and any compliance or data residency needs, and we will reply with a proposal.
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
                                Traffic to niato ai runs over HTTPS, and your conversations are readable only from your own account. Configurable retention, storage-level encryption and private deployment are part of what an Enterprise agreement can cover — tell us your requirements and we will put them in the proposal.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
