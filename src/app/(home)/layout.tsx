import type { Metadata } from 'next'
import { Spotlight } from "@/components/ui/spotlight"
//import { Footer } from "./components/footer"
import Navbar from "./components/navbar"
import Footer from "./components/footer"

export const metadata: Metadata = {
    title: 'niato ai',
    description:
        'niato ai is a multi-model AI workspace for chat, reasoning, content creation, and developer productivity.',
    keywords: ['niato ai', 'ai chat app', 'multi-model ai', 'ai productivity'],
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {/* Le Spotlight est purement decoratif mais etait en `absolute`
                directement sur <body> : il depassait de quelques pixels a
                droite et rendait toute la page scrollable horizontalement.
                Ce conteneur le rogne sans rien changer a son rendu. */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
                <Spotlight
                    className="-top-40 left-0 md:-top-20 md:left-60"
                    fill="var(--primary)"
                />
            </div>
            <main className="min-h-screen max-w-[1280px] mx-auto pt-[80px]">
                {children}
            </main>
            <Footer />
        </>
    )
}
