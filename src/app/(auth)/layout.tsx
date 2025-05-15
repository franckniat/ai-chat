import { Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Sparkles className="size-4" />
                        </div>
                        niato ai.
                    </Link>
                </div>
                {children}
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src="/images/auth-banner.png"
                    width={1200}
                    height={1200}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.8] dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}