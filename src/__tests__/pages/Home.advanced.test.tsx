import { describe, expect, test, beforeEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HomePage from "../../app/(home)/page";

/**
 * Tests de structure accessible.
 *
 * L'ancienne version de ce fichier verifiait l'imbrication des `<div>` et le
 * positionnement du gradient decoratif — du detail d'implementation qui casse
 * a chaque refonte. On verifie ici ce qui a une consequence reelle pour un
 * utilisateur de lecteur d'ecran ou de navigation clavier.
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

describe("HomePage — structure accessible", () => {
    beforeEach(() => {
        cleanup();
    });

    test("n'expose qu'un seul <h1>", () => {
        render(<HomePage />);
        expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });

    test("ne saute aucun niveau de titre", () => {
        render(<HomePage />);

        const levels = screen
            .getAllByRole("heading")
            .map((h) => Number(h.tagName.slice(1)));

        expect(levels[0]).toBe(1);

        // Un niveau ne peut progresser que d'un cran a la fois (h2 -> h4 est un saut).
        for (let i = 1; i < levels.length; i += 1) {
            expect(
                levels[i] - levels[i - 1],
                `saut de h${levels[i - 1]} a h${levels[i]}`,
            ).toBeLessThanOrEqual(1);
        }
    });

    test("les titres de features sont de vrais titres, pas des div", () => {
        render(<HomePage />);

        for (const feature of ["Several models", "Searchable history"]) {
            expect(
                screen.getByRole("heading", { name: feature }),
            ).toBeInTheDocument();
        }
    });

    test("les questions de la FAQ sont de vrais titres", () => {
        render(<HomePage />);

        expect(
            screen.getByRole("heading", { name: /is it really free/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /are my conversations kept/i }),
        ).toBeInTheDocument();
    });

    test("chaque lien porte un nom accessible", () => {
        render(<HomePage />);

        for (const link of screen.getAllByRole("link")) {
            expect(
                link.textContent?.trim() || link.getAttribute("aria-label"),
                `lien sans libelle: ${link.outerHTML.slice(0, 80)}`,
            ).toBeTruthy();
        }
    });

    test("aucun titre n'est vide", () => {
        render(<HomePage />);

        for (const heading of screen.getAllByRole("heading")) {
            expect(heading.textContent?.trim()).toBeTruthy();
        }
    });
});
