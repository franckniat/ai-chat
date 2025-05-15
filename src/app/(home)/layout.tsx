import { Spotlight } from "@/components/ui/spotlight"
//import { Footer } from "./components/footer"
import Navbar from "./components/navbar"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="var(--primary)" />
            <main className="min-h-screen max-w-[1280px] mx-auto pt-[80px]">
                {children}
            </main>
        </>
    )
}