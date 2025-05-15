"use client";

import Image from "next/image"

export function Footer() {
    return (
        <footer className="bg-background py-12 px-4 md:px-6 lg:px-12">
            <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
                <p>
                    <span>&copy; {new Date().getFullYear()} Franck Niat</span>
                    <a
                        href="https://github.com/franckniat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline transition-colors hover:text-primary-foreground"
                    >
                        GitHub
                    </a>
                </p>
                <p>
                    <a
                        href="https://vercel.com?utm_source=niato&utm_campaign=oss"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="/vercel.svg"
                            alt="Vercel"
                            className="h-8 w-auto"
                            width={150}
                            height={40}
                        />
                    </a>
                </p>
            </div>
        </footer>
    )
}
