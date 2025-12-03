
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
    Sparkles,
    MessageSquare,
    Image as ImageIcon,
    Brain,
    FileText,
    Code2,
    Zap,
    Globe,
    Shield,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Feature {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    highlights: string[];
    reverse?: boolean;
}

const mainFeatures: Feature[] = [
    {
        title: "Intelligent Conversations",
        description:
            "Engage in natural, context-aware conversations with our advanced AI models. Whether you need help brainstorming, researching, or problem-solving, Niato AI understands your intent and provides thoughtful, relevant responses.",
        image: "/images/features/chat-demo.png",
        imageAlt: "AI Chat conversation demo",
        highlights: [
            "Context-aware responses that remember your conversation",
            "Multiple AI models to choose from (GPT-4, Gemini, Claude)",
            "Real-time streaming for instant feedback",
            "Support for follow-up questions and clarifications",
        ],
    },
    {
        title: "Advanced Reasoning",
        description:
            "Tackle complex problems with AI models that think step-by-step. Our reasoning models break down difficult questions, show their thought process, and arrive at well-reasoned conclusions.",
        image: "/images/features/reasoning-demo.png",
        imageAlt: "AI Reasoning demonstration",
        highlights: [
            "Step-by-step problem solving",
            "Transparent thought process visualization",
            "Mathematical and logical reasoning",
            "Complex analysis and decision support",
        ],
        reverse: true,
    },
    {
        title: "Image Generation",
        description:
            "Bring your ideas to life with AI-powered image generation. Create stunning visuals, illustrations, and artwork from simple text descriptions. Perfect for designers, marketers, and creative professionals.",
        image: "/images/features/image-gen-demo.png",
        imageAlt: "AI Image generation demo",
        highlights: [
            "Generate images from text descriptions",
            "Multiple styles and artistic directions",
            "High-resolution outputs",
            "Edit and refine generated images",
        ],
    },
    {
        title: "Document Analysis",
        description:
            "Upload documents and let AI extract insights, summarize content, and answer questions about your files. Support for PDFs, Word documents, and more.",
        image: "/images/features/document-demo.png",
        imageAlt: "Document analysis demo",
        highlights: [
            "PDF and document parsing",
            "Intelligent summarization",
            "Q&A over your documents",
            "Extract key information automatically",
        ],
        reverse: true,
    },
    {
        title: "Code Assistant",
        description:
            "Get help writing, debugging, and understanding code. Our AI understands dozens of programming languages and can help you become a more productive developer.",
        image: "/images/features/code-demo.png",
        imageAlt: "Code assistant demo",
        highlights: [
            "Code generation and completion",
            "Bug detection and fixes",
            "Code explanation and documentation",
            "Support for 50+ programming languages",
        ],
    },
];

const capabilities = [
    {
        icon: <MessageSquare className="size-6" />,
        title: "Natural Language",
        description: "Communicate naturally, just like talking to a human expert",
    },
    {
        icon: <Brain className="size-6" />,
        title: "Deep Understanding",
        description: "AI that truly understands context and nuance",
    },
    {
        icon: <Zap className="size-6" />,
        title: "Lightning Fast",
        description: "Get responses in real-time with streaming technology",
    },
    {
        icon: <Globe className="size-6" />,
        title: "Multilingual",
        description: "Communicate in multiple languages seamlessly",
    },
    {
        icon: <Shield className="size-6" />,
        title: "Secure & Private",
        description: "Your conversations are encrypted and protected",
    },
    {
        icon: <Code2 className="size-6" />,
        title: "Developer Friendly",
        description: "API access for custom integrations",
    },
];

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-[1280px] mx-auto text-center">
                    <Badge
                        variant="outline"
                        className="px-4 py-2 text-sm rounded-full backdrop-blur-sm mb-6"
                    >
                        <Sparkles className="mr-2 size-4" />
                        Discover our features
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-mono mb-6">
                        The future of AI,{" "}
                        <span className="text-primary relative inline-block">
                            at your fingertips
                            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full opacity-50" />
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                        Explore the powerful capabilities of Niato AI. From intelligent
                        conversations to image generation, discover how AI can transform the
                        way you work and create.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/chat"
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "px-8 text-lg h-12 rounded-full shadow-lg hover:shadow-primary/25"
                            )}
                        >
                            Try it Now
                            <ArrowRight className="ml-2 size-5" />
                        </Link>
                        <Link
                            href="/pricing"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "px-8 text-lg h-12 rounded-full"
                            )}
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Features with Images */}
            <section className="px-4 py-16">
                <div className="max-w-[1280px] mx-auto space-y-24 md:space-y-32">
                    {mainFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className={cn(
                                "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center",
                                feature.reverse && "lg:[&>*:first-child]:order-2"
                            )}
                        >
                            {/* Content */}
                            <div className="space-y-6">
                                <Badge variant="secondary" className="px-3 py-1">
                                    Feature {index + 1}
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-bold">
                                    {feature.title}
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                                <ul className="space-y-3">
                                    {feature.highlights.map((highlight, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/chat"
                                    className={cn(
                                        buttonVariants({ variant: "outline" }),
                                        "rounded-full mt-4"
                                    )}
                                >
                                    Try this feature
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </div>

                            {/* Image */}
                            <div className="relative">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border bg-muted/50 shadow-2xl">
                                    {/* Placeholder for demo image */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                        <div className="text-center p-8">
                                            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                                {index === 0 && <MessageSquare className="size-8 text-primary" />}
                                                {index === 1 && <Brain className="size-8 text-primary" />}
                                                {index === 2 && <ImageIcon className="size-8 text-primary" />}
                                                {index === 3 && <FileText className="size-8 text-primary" />}
                                                {index === 4 && <Code2 className="size-8 text-primary" />}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {feature.imageAlt}
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 mt-2">
                                                Add image: {feature.image}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Uncomment when you have actual images */}
                                    {/* <Image
                                        src={feature.image}
                                        alt={feature.imageAlt}
                                        fill
                                        className="object-cover"
                                    /> */}
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl opacity-50" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Capabilities Grid */}
            <section className="px-4 py-20 bg-muted/30">
                <div className="max-w-[1280px] mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Built for excellence
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Every feature is designed with performance, security, and user
                            experience in mind
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((capability, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="mx-auto p-3 rounded-xl bg-primary/10 text-primary w-fit mb-2">
                                        {capability.icon}
                                    </div>
                                    <CardTitle className="text-lg">{capability.title}</CardTitle>
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

            {/* CTA Section */}
            <section className="px-4 py-20">
                <div className="max-w-[1280px] mx-auto">
                    <Card className="bg-primary text-primary-foreground overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
                        <div className="relative p-8 md:p-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to experience the power of AI?
                            </h2>
                            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of users who are already transforming their
                                productivity with Niato AI. Start for free today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/register"
                                    className={cn(
                                        buttonVariants({ variant: "secondary", size: "lg" }),
                                        "px-8 text-lg h-12 rounded-full"
                                    )}
                                >
                                    Get Started Free
                                    <Sparkles className="ml-2 size-5" />
                                </Link>
                                <Link
                                    href="/support"
                                    className={cn(
                                        buttonVariants({ variant: "outline", size: "lg" }),
                                        "px-8 text-lg h-12 rounded-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                                    )}
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
