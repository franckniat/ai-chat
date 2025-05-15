import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function HomePage() {
    return (
        <div className='px-4 py-5'>
            <div className="pt-[130px] md:pt-[190px] lg:pt-[250px]">
                <div className="max-w-[1280px] mx-auto px-3 ">
                    <div className="flex items-center flex-col justify-center gap-5">
                        <Link href="/chat?model=gpt-4o-mini&source=home">
                            <Badge variant="outline">
                                🚀 Chat with GPT-4o-mini for free
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="lucide lucide-arrow-right-icon lucide-arrow-right transition-transform">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </Badge>
                        </Link>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                            Discover a new experience with {" "}
                            <span className="text-primary relative">
                                ai
                                <span
                                    className="absolute top-12 md:top-16 left-0 w-full h-0.5  bg-gradient-to-r from-primary via-base-100/50 to-primary rounded-full"/>
                            </span>
                        </h1>
                        <p className="base md:text-lg lg:text-xl max-w-3xl text-center">
                            niato ai. is a chatbot that can help you with your daily tasks.
                        </p>
                        <div className="flex max-sm:flex-col items-center gap-3 pt-3 sm:justify-center w-full">
                            <Button className="group max-sm:w-full" size="lg">Try for free</Button>
                            <Button className="group max-sm:w-full" variant="ghost" size="lg">Our pricing<svg
                                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ease-out">
                                <path d="M7 7h10v10" />
                                <path d="M7 17 17 7" />
                            </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
