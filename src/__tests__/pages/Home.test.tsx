import { describe, expect, test, beforeEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HomePage from "../../app/(home)/page";

/**
 * Ces tests portent sur ce que la page *fait* : les titres qu'elle annonce et
 * les destinations vers lesquelles elle envoie le visiteur.
 *
 * Ils n'assertent volontairement aucune classe CSS. L'ancienne version testait
 * `.px-4.py-5`, le positionnement du gradient ou les classes responsive : ces
 * assertions cassent a chaque changement de style sans jamais detecter de
 * regression reelle.
 */

vi.mock("next/link", () => ({
    default: ({
        children,
        href,
        ...props
    }: {
        children: React.ReactNode;
        href: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

describe("HomePage", () => {
    beforeEach(() => {
        cleanup();
    });

    test("annonce le produit dans un titre de niveau 1 unique", () => {
        render(<HomePage />);

        const headings = screen.getAllByRole("heading", { level: 1 });
        expect(headings).toHaveLength(1);
        expect(headings[0]).toHaveTextContent(/unlock the power of/i);
        expect(headings[0]).toHaveTextContent(/ai intelligence/i);
    });

    test("presente la proposition de valeur", () => {
        render(<HomePage />);

        expect(
            screen.getByText(/experience the next generation of ai chat/i),
        ).toBeInTheDocument();
    });

    test("envoie les deux CTA principaux vers le chat et la tarification", () => {
        render(<HomePage />);

        expect(screen.getByRole("link", { name: /start chatting/i })).toHaveAttribute(
            "href",
            "/chat",
        );
        expect(screen.getByRole("link", { name: /view pricing/i })).toHaveAttribute(
            "href",
            "/pricing",
        );
    });

    test("le bandeau d'annonce mene au chat", () => {
        render(<HomePage />);

        const banner = screen.getByRole("link", { name: /new: chat with deepseek/i });
        expect(banner).toHaveAttribute("href", "/chat");
    });

    test("le CTA de bas de page mene au chat", () => {
        render(<HomePage />);

        expect(
            screen.getByRole("link", { name: /get started for free/i }),
        ).toHaveAttribute("href", "/chat");
    });

    test("chaque lien pointe vers une destination interne non vide", () => {
        render(<HomePage />);

        for (const link of screen.getAllByRole("link")) {
            const href = link.getAttribute("href");
            expect(href, `lien "${link.textContent?.trim()}" sans href`).toBeTruthy();
            expect(href).toMatch(/^\//);
        }
    });

    test("rend les quatre sections de la page", () => {
        render(<HomePage />);

        for (const title of [
            /why choose niato ai/i,
            /loved by thousands/i,
            /frequently asked questions/i,
            /ready to supercharge your productivity/i,
        ]) {
            expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
        }
    });

    test("liste les six arguments produit", () => {
        render(<HomePage />);

        for (const feature of [
            "Multi-Model Support",
            "Lightning Fast",
            "Secure & Private",
            "Smart Context",
            "Chat History",
            "Code Highlighting",
        ]) {
            expect(screen.getByText(feature)).toBeInTheDocument();
        }
    });

    test("affiche trois temoignages, chacun avec un auteur et un role", () => {
        render(<HomePage />);

        for (const [name, role] of [
            ["Sarah Chen", "Software Engineer"],
            ["Alex Rivera", "Content Creator"],
            ["Jordan Smith", "Product Manager"],
        ]) {
            expect(screen.getByText(name)).toBeInTheDocument();
            expect(screen.getByText(role)).toBeInTheDocument();
        }
    });

    test("chaque question de la FAQ est accompagnee de sa reponse", () => {
        render(<HomePage />);

        const faq = screen
            .getByRole("heading", { name: /frequently asked questions/i })
            .closest("section");
        expect(faq).not.toBeNull();

        const questions = within(faq as HTMLElement).getAllByRole("heading", {
            level: 3,
        });
        expect(questions.length).toBeGreaterThanOrEqual(3);
    });
});
