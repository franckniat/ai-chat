import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";

export default function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navbar');

    const footerlinks = [
        { name: tNav('home'), href: "/" },
        { name: tNav('products'), href: "/products" },
        { name: tNav('pricing'), href: "/pricing" },
        { name: t('contact'), href: "/support" },
        { name: t('terms'), href: "/terms" },
    ];
    return (
        <footer className="py-10 border-t border-foreground/10 max-w-[1000px] mx-auto px-4 space-y-3 my-5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6">
                {footerlinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm text-foreground hover:text-primary transition-colors px-5"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
            <p className="text-sm text-center text-foreground/70 pt-4">
                © 2025 niato ai. {t('rights')}
            </p>
        </footer>
    );
}
