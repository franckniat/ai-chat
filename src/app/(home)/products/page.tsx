import type { Metadata } from 'next'
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Brain,
    CheckCircle2,
    Code2,
    History,
    type LucideIcon,
    MessageSquare,
    Repeat2,
    Sparkles,
    Sigma,
    Palette,
    LogIn,
    MoonStar,
} from "lucide-react";
import Link from "next/link";
import { GOOGLE_MODELS } from "@/lib/google-models";
import { personalities } from "@/lib/personalities";

export const metadata: Metadata = {
    title: 'niato ai features',
    description:
        'What niato ai can do: the free Google Gemini models behind one composer, visible reasoning, rendered code and math, a searchable history, and selectable answer tones.',
    keywords: ['niato ai', 'ai features', 'reasoning ai', 'gemini', 'free ai models'],
    alternates: {
        canonical: '/products',
    },
}

const modelCount = GOOGLE_MODELS.length;
const reasoningCount = GOOGLE_MODELS.filter((model) => model.isReasoning).length;

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
    highlights: string[];
    reverse?: boolean;
}

/**
 * Chaque entree correspond a du code existant.
 *
 * La version precedente annoncait de la generation d'images, de l'analyse de
 * documents et un acces API : aucun des trois n'existe. Elle citait aussi
 * DeepSeek, Llama 4 et Qwen, absents du catalogue, et affichait aux
 * visiteurs un texte de chantier (« Add image: /images/features/... ») a la
 * place d'illustrations jamais ajoutees.
 */
const mainFeatures: Feature[] = [
    {
        title: "One composer, several models",
        description:
            `Pick among ${modelCount} free Google models without leaving the conversation. The selector sits under the composer, and your choice applies to the next message — the thread is never reset.`,
        icon: MessageSquare,
        highlights: [
            "Models grouped by capability: Elite, Solide, Leger",
            "Switch mid-conversation, history is preserved",
            "Replies stream token by token",
        ],
    },
    {
        title: "Failover instead of errors",
        description:
            "Free models share throughput limits, and hitting one normally ends the request. niato ai catches the rate limit, moves to the next model in the list and restarts the answer, telling you what it switched to.",
        icon: Repeat2,
        highlights: [
            "Rate limits are detected and handled automatically",
            "Up to two fallbacks before giving up",
            "A notification names the model that took over",
        ],
        reverse: true,
    },
    {
        title: "Reasoning you can open",
        description:
            reasoningCount > 0
                ? "Reasoning models expose the steps they went through before answering. The trace streams live in a panel you can fold away once you have read it."
                : "When a reasoning model is selected, the steps it went through before answering stream into a panel you can fold away.",
        icon: Brain,
        highlights: [
            "Thought process streamed as it is produced",
            "Collapsible panel, kept out of the way by default",
            "Sources are listed separately from the answer",
        ],
    },
    {
        title: "Code and math, properly rendered",
        description:
            "Answers are rendered as Markdown: fenced code gets syntax highlighting and a copy button, LaTeX is typeset with KaTeX, and tables keep their structure.",
        icon: Code2,
        highlights: [
            "Syntax highlighting with per-block copy",
            "Inline and display math via KaTeX",
            "GitHub-flavoured Markdown: tables, task lists, strikethrough",
            "Generated HTML is sanitised before rendering",
        ],
        reverse: true,
    },
    {
        title: "A history you can actually search",
        description:
            "Every conversation is saved to your account and grouped by date in the sidebar. Search matches conversation titles and the content of the messages themselves.",
        icon: History,
        highlights: [
            "Grouped as Today, Yesterday and Older",
            "Full-text search across titles and messages",
            "Ctrl+K opens the search palette",
            "Deleting a conversation can be undone",
        ],
    },
];

const capabilities = [
    {
        icon: <Sparkles className="size-6" />,
        title: `${personalities.length} answer tones`,
        description: "Change how the assistant replies without rewriting your instructions",
    },
    {
        icon: <Sigma className="size-6" />,
        title: "LaTeX math",
        description: "Formulas typeset inline and as display blocks",
    },
    {
        icon: <Palette className="size-6" />,
        title: "Light and dark",
        description: "Follows your system theme, or pick one explicitly",
    },
    {
        icon: <LogIn className="size-6" />,
        title: "Email, Google, GitHub",
        description: "Sign in the way you prefer, with email verification",
    },
    {
        icon: <MoonStar className="size-6" />,
        title: "Auto-named threads",
        description: "Each new conversation gets a title from your first message",
    },
    {
        icon: <Code2 className="size-6" />,
        title: "Open source",
        description: "The whole application is MIT licensed and readable",
    },
];

export default function ProductsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Hero */}
            <section className="px-4 py-16 md:py-24">
                <div className="mx-auto max-w-[1280px] text-center">
                    <Badge
                        variant="outline"
                        className="mb-6 rounded-full px-4 py-2 text-sm backdrop-blur-sm"
                    >
                        <Sparkles className="mr-2 size-4" />
                        What&apos;s inside
                    </Badge>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        Everything here{" "}
                        <span className="text-primary relative inline-block">
                            actually ships
                            <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r opacity-50" />
                        </span>
                    </h1>

                    <p className="text-muted-foreground mx-auto mb-10 max-w-3xl text-lg md:text-xl">
                        No roadmap items, no coming-soon badges. Every capability below is in
                        the application today and you can try it for free.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/chat"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "hover:shadow-primary/25 h-12 rounded-full px-8 text-lg shadow-lg",
                            )}
                        >
                            Try it now
                            <ArrowRight className="ml-2 size-5" />
                        </Link>
                        <Link
                            href="/pricing"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "h-12 rounded-full px-8 text-lg",
                            )}
                        >
                            View plans
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main features */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-[1280px] space-y-24 md:space-y-32">
                    {mainFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className={cn(
                                    "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16",
                                    feature.reverse && "lg:[&>*:first-child]:order-2",
                                )}
                            >
                                <div className="space-y-6">
                                    <Badge variant="secondary" className="px-3 py-1">
                                        Feature {index + 1}
                                    </Badge>
                                    <h2 className="text-3xl font-bold md:text-4xl">
                                        {feature.title}
                                    </h2>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {feature.highlights.map((highlight) => (
                                            <li key={highlight} className="flex items-start gap-3">
                                                <CheckCircle2 className="text-primary mt-0.5 size-5 shrink-0" />
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/chat"
                                        className={cn(
                                            buttonVariants({ variant: "outline" }),
                                            "mt-4 rounded-full",
                                        )}
                                    >
                                        Try this feature
                                        <ArrowRight className="ml-2 size-4" />
                                    </Link>
                                </div>

                                {/* Visuel typographique plutot qu'un emplacement
                                    d'image vide : les captures referencees
                                    n'existaient pas dans /public. */}
                                <div className="relative" aria-hidden="true">
                                    <div className="bg-muted/40 relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border shadow-sm">
                                        <div className="from-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br" />
                                        <div className="relative flex flex-col items-center gap-4 p-8 text-center">
                                            <div className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-2xl">
                                                <Icon className="size-8" />
                                            </div>
                                            <p className="font-display text-2xl font-semibold">
                                                {feature.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="from-primary/20 to-primary/5 absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r opacity-50 blur-2xl" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Capabilities */}
            <section className="bg-muted/30 px-4 py-20">
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Smaller things that help
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            Details that make daily use less tedious
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {capabilities.map((capability) => (
                            <Card
                                key={capability.title}
                                className="text-center transition-shadow hover:shadow-lg"
                            >
                                <CardHeader>
                                    <div className="bg-primary/10 text-primary mx-auto mb-2 w-fit rounded-xl p-3">
                                        {capability.icon}
                                    </div>
                                    <CardTitle asChild className="text-lg">
                                        <h3>{capability.title}</h3>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {capability.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-20">
                <div className="mx-auto max-w-[1280px]">
                    <Card className="bg-primary text-primary-foreground relative overflow-hidden">
                        <div className="from-primary to-primary/80 absolute inset-0 bg-gradient-to-br" />
                        <div className="relative p-8 text-center md:p-12">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Everything above is free
                            </h2>
                            <p className="text-primary-foreground/80 mx-auto mb-8 max-w-2xl text-lg">
                                Create an account and start a conversation. No card, no trial
                                countdown.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/register"
                                    className={cn(
                                        buttonVariants({ variant: "secondary", size: "lg" }),
                                        "h-12 rounded-full px-8 text-lg",
                                    )}
                                >
                                    Create an account
                                    <Sparkles className="ml-2 size-5" />
                                </Link>
                                <Link
                                    href="/support"
                                    className={cn(
                                        buttonVariants({ variant: "outline", size: "lg" }),
                                        "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-12 rounded-full bg-transparent px-8 text-lg",
                                    )}
                                >
                                    Contact us
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
