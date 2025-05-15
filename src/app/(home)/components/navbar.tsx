"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const navLinks = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/products",
            label: "Products",
            active: pathname === "/products",
        },
        {
            href: "/pricing",
            label: "Pricing",
            active: pathname === "/pricing",
        },
        {
            href: "/contact",
            label: "Contact",
            active: pathname === "/contact",
        },
    ];

    useEffect(() => {
        const navbar = document.querySelector(".navbar");
        const handleScroll = () => {
            if (window.scrollY > 30) {
                navbar?.classList.add("border", "border-foreground/20", "shadow-lg", "bg-background/60", "backdrop-blur-lg");
            } else {
                navbar?.classList.remove("border", "border-foreground/20", "shadow-lg", "bg-background/60", "backdrop-blur-lg");
            }
        };
        if (navbar) {
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);
    return (
        <nav className="navbar fixed top-3 z-50 lg:min-w-[900px] w-full max-w-[1000px] md:min-w-[600px] left-1/2 -translate-x-1/2 rounded-xl">
            <div className="max-w-[1280px] mx-auto px-3">
                <div className="flex items-center justify-between h-[65px]">
                    <Link href="/" className="flex items-center gap-2 lg:gap-3">
                        <Sparkles className="size-4" />
                        <span className=" text-base lg:text-lg font-bold">niato ai .</span>
                    </Link>
                    <div className="hidden items-center gap-2 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm hover:text-primary/80 px-3 py-2 transition-colors font-medium ${link.active ? "text-primary font-bold underline underline-offset-4" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            className="relative"
                            variant={"ghost"}
                            onClick={() => {
                                setTheme(theme === "dark" ? "light" : "dark");
                            }}
                        >
                            <Sun className="size-4 dark:scale-0 scale-100 rotate-0 dark:rotate-12 transition-all absolute" />
                            <Moon className="size-4 dark:scale-100 scale-0 dark:rotate-0 rotate-12 transition-all" />
                        </Button>
                        <Link href={"/login"}>
                            <Button size={"sm"} className="hidden md:block text-sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
