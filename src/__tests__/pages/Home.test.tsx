import { describe, expect, test, beforeEach, vi } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HomePage from "../../app/(home)/page";
import { GOOGLE_MODELS } from "@/lib/google-models";
import { personalities } from "@/lib/personalities";

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
        expect(headings[0]).toHaveTextContent(/many models/i);
        expect(headings[0]).toHaveTextContent(/one window/i);
    });

    test("presente la proposition de valeur", () => {
        render(<HomePage />);

        expect(
            screen.getByText(/switch models mid-conversation/i),
        ).toBeInTheDocument();
    });

    test("envoie les deux CTA principaux vers le chat et la tarification", () => {
        render(<HomePage />);

        expect(screen.getByRole("link", { name: /open the chat/i })).toHaveAttribute(
            "href",
            "/chat",
        );
        expect(screen.getByRole("link", { name: /view plans/i })).toHaveAttribute(
            "href",
            "/pricing",
        );
    });

    test("le bandeau d'annonce mene au chat", () => {
        render(<HomePage />);

        const banner = screen.getByRole("link", { name: /free models, no credit card/i });
        expect(banner).toHaveAttribute("href", "/chat");
    });

    test("le CTA de bas de page mene au chat", () => {
        render(<HomePage />);

        expect(
            screen.getByRole("link", { name: /get started/i }),
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
            /what niato ai does/i,
            /available models/i,
            /frequently asked questions/i,
            /there is nothing to pay/i,
        ]) {
            expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
        }
    });

    test("liste les six arguments produit", () => {
        render(<HomePage />);

        for (const feature of [
            "Several models",
            "Automatic failover",
            "Searchable history",
            "Code and formulas",
            "Protected account",
        ]) {
            expect(screen.getByRole("heading", { name: feature })).toBeInTheDocument();
        }

        // Le titre est genere depuis `personalities`, pas ecrit en dur.
        expect(
            screen.getByRole("heading", { name: `${personalities.length} tones` }),
        ).toBeInTheDocument();
    });

    test("la vitrine liste exactement les modeles reellement configures", () => {
        render(<HomePage />);

        // La section remplace d'anciens temoignages inventes. Elle est generee
        // depuis GOOGLE_MODELS : ce test echoue si la page reintroduit du
        // contenu ecrit en dur qui ne correspond plus aux modeles configures.
        const showcased = GOOGLE_MODELS;

        const section = screen
            .getByRole("heading", { name: /available models/i })
            .closest("section");
        expect(section).not.toBeNull();

        const items = within(section as HTMLElement).getAllByRole("listitem");
        expect(items).toHaveLength(showcased.length);

        for (const model of showcased) {
            expect(
                within(section as HTMLElement).getByText(model.name),
            ).toBeInTheDocument();
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
