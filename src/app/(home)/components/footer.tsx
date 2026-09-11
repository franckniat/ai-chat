import Link from "next/link";
import { Github, Sparkles } from "lucide-react";
import React from "react";
import { siteConfig } from "@/lib/site";

export default function Footer() {
	// Trois de ces liens pointaient vers des routes inexistantes : Products
	// vers /posts, Pricing vers /about, et Contact vers /Contact — le routage
	// de Next est sensible a la casse, donc ce dernier renvoyait un 404.
	const footerlinks = [
		{ name: "Home", href: "/" },
		{ name: "Products", href: "/products" },
		{ name: "Pricing", href: "/pricing" },
		{ name: "Contact", href: "/support" },
		{ name: "Terms & privacy", href: "/terms" },
	];

	return (
		<footer className="border-foreground/10 mx-auto my-5 max-w-[1000px] space-y-3 border-t px-4 py-10">
			<div className="flex flex-col items-center justify-center gap-4 py-6 sm:flex-row sm:flex-wrap">
				{footerlinks.map((link) => (
					<Link
						key={link.name}
						href={link.href}
						className="text-foreground hover:text-primary px-5 text-sm transition-colors"
					>
						{link.name}
					</Link>
				))}

				<a
					href={siteConfig.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-foreground hover:text-primary inline-flex items-center gap-2 px-5 text-sm transition-colors"
				>
					<Github className="size-4" aria-hidden="true" />
					GitHub
				</a>
			</div>

			<p className="text-foreground/70 flex flex-col items-center justify-center gap-1 pt-4 text-center text-sm sm:flex-row sm:gap-2">
				<span className="inline-flex items-center gap-1.5">
					<Sparkles className="size-3.5" aria-hidden="true" />
					{/* L'annee etait figee a 2025 dans le texte. */}© {new Date().getFullYear()}{" "}
					{siteConfig.name}
				</span>
				<span aria-hidden="true" className="hidden sm:inline">
					·
				</span>
				<span>
					Open source under the{" "}
					<a
						href={`${siteConfig.githubUrl}/blob/main/LICENSE`}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primary underline underline-offset-4 transition-colors"
					>
						MIT licence
					</a>
				</span>
			</p>
		</footer>
	);
}
