import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import HomePage from "../../app/(home)/page";

// Mock Next.js Link component
vi.mock('next/link', () => {
return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any; }) => {
        return <a href={href} {...props}>{children}</a>;
    }
};
});

describe("HomePage - Advanced Tests", () => {
  beforeEach(() => {
    cleanup();
  });

  test("displays all required elements in correct hierarchy", () => {
    render(<HomePage />);

    // Vérifier la hiérarchie de la page
    const mainContainer = document.querySelector('.px-4.py-5');
    expect(mainContainer).toBeInTheDocument();

    // Vérifier que le lien du badge est dans le bon conteneur
    const badgeLink = screen.getByRole("link");
    expect(badgeLink.closest('.flex.items-center.flex-col.justify-center')).toBeInTheDocument();

    // Vérifier que les boutons sont dans le bon conteneur
    const tryFreeButton = screen.getByRole("button", { name: /try for free/i });
    const pricingButton = screen.getByRole("button", { name: /our pricing/i });

    expect(tryFreeButton.closest('.flex.max-sm\\:flex-col')).toBeInTheDocument();
    expect(pricingButton.closest('.flex.max-sm\\:flex-col')).toBeInTheDocument();
  });

  test("badge link has correct accessibility attributes", () => {
    render(<HomePage />);

    const badgeLink = screen.getByRole("link");
    expect(badgeLink).toHaveAttribute("href", "/chat?model=gpt-4o-mini&source=home");

    // Vérifier que le badge contient les éléments attendus
    expect(badgeLink).toHaveTextContent("🚀 Chat with GPT-4o-mini for free");

    // Vérifier que l'icône flèche est présente
    const arrowIcon = badgeLink.querySelector('svg');
    expect(arrowIcon).toBeInTheDocument();
  });

  test("buttons have correct styling and structure", () => {
    render(<HomePage />);

    const tryFreeButton = screen.getByRole("button", { name: /try for free/i });
    const pricingButton = screen.getByRole("button", { name: /our pricing/i });

    // Vérifier les classes CSS importantes
    expect(tryFreeButton).toHaveClass("group");
    expect(pricingButton).toHaveClass("group");

    // Vérifier que le bouton pricing a une icône
    const pricingIcon = pricingButton.querySelector('svg');
    expect(pricingIcon).toBeInTheDocument();
  });

  test("responsive design classes are applied", () => {
    render(<HomePage />);

    // Vérifier les classes responsive sur le titre
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-3xl", "md:text-4xl", "lg:text-5xl");

    // Vérifier les classes responsive sur la description
    const description = screen.getByText("niato ai. is a chatbot that can help you with your daily tasks.");
    expect(description).toHaveClass("base", "md:text-lg", "lg:text-xl");

    // Vérifier les classes responsive sur les boutons
    const buttonsContainer = document.querySelector('.flex.max-sm\\:flex-col');
    expect(buttonsContainer).toBeInTheDocument();
  });

  test("gradient decoration is properly positioned", () => {
    render(<HomePage />);

    const aiSpan = screen.getAllByText("ai")[0];
    const gradientSpan = aiSpan.querySelector('span');

    expect(gradientSpan).toHaveClass(
      "absolute",
      "top-12",
      "md:top-16",
      "left-0",
      "w-full",
      "h-0.5",
      "bg-gradient-to-r",
      "from-primary",
      "via-base-100/50",
      "to-primary",
      "rounded-full"
    );
  });

  test("content is properly centered and spaced", () => {
    render(<HomePage />);

    // Vérifier le conteneur principal centré
    const centeredContainer = document.querySelector('.flex.items-center.flex-col.justify-center.gap-5');
    expect(centeredContainer).toBeInTheDocument();

    // Vérifier les espaces
    expect(centeredContainer).toHaveClass("gap-5");

    // Vérifier le conteneur de boutons
    const buttonContainer = document.querySelector('.flex.max-sm\\:flex-col.items-center.gap-3');
    expect(buttonContainer).toBeInTheDocument();
  });

  test("all text content is accessible", () => {
    render(<HomePage />);

    // Vérifier que tous les textes sont visibles et accessibles
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(screen.getByText("niato ai. is a chatbot that can help you with your daily tasks.")).toBeVisible();
    expect(screen.getByRole("link")).toBeVisible();
    expect(screen.getByRole("button", { name: /try for free/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /our pricing/i })).toBeVisible();
  });

  test("layout structure is correct", () => {
    render(<HomePage />);

    // Vérifier la structure en partant du plus haut niveau
    const outerContainer = document.querySelector('.px-4.py-5');
    expect(outerContainer).toBeInTheDocument();

    const paddingContainer = outerContainer?.querySelector('.pt-\\[130px\\]');
    expect(paddingContainer).toBeInTheDocument();

    const maxWidthContainer = paddingContainer?.querySelector('.max-w-\\[1280px\\]');
    expect(maxWidthContainer).toBeInTheDocument();

    const centeredContainer = maxWidthContainer?.querySelector('.flex.items-center.flex-col.justify-center');
    expect(centeredContainer).toBeInTheDocument();
  });
});
