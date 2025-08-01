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

describe("HomePage", () => {
  beforeEach(() => {
    cleanup();
  });

  test("renders without crashing", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  test("displays the main heading with correct text", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Discover a new experience with");
    expect(heading).toHaveTextContent("ai");
  });

  test("displays the description text", () => {
    render(<HomePage />);
    expect(screen.getByText("niato ai. is a chatbot that can help you with your daily tasks.")).toBeInTheDocument();
  });

  test("displays the GPT-4o-mini badge with correct link", () => {
    render(<HomePage />);
    const badgeLink = screen.getByRole("link");
    expect(badgeLink).toBeInTheDocument();
    expect(badgeLink).toHaveAttribute("href", "/chat?model=gpt-4o-mini&source=home");
    expect(badgeLink).toHaveTextContent("🚀 Chat with GPT-4o-mini for free");
  });

  test("displays both action buttons", () => {
    render(<HomePage />);
    expect(screen.getByRole("button", { name: /try for free/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /our pricing/i })).toBeInTheDocument();
  });

  test("has correct main container structure", () => {
    render(<HomePage />);
    const mainDiv = document.querySelector('.px-4.py-5');
    expect(mainDiv).toBeInTheDocument();
  });

  test("displays the 'ai' text with primary styling", () => {
    render(<HomePage />);
    const aiSpan = screen.getAllByText("ai")[0]; // Prendre le premier élément
    expect(aiSpan).toBeInTheDocument();
    expect(aiSpan).toHaveClass("text-primary", "relative");
  });

  test("contains the rocket emoji in the badge", () => {
    render(<HomePage />);
    expect(screen.getByText(/🚀/)).toBeInTheDocument();
  });

  test("displays the underline decoration for 'ai' text", () => {
    render(<HomePage />);
    const aiSpan = screen.getAllByText("ai")[0];
    const underlineSpan = aiSpan.querySelector('span');
    expect(underlineSpan).toBeInTheDocument();
    expect(underlineSpan).toHaveClass("absolute");
  });

  test("has responsive padding structure", () => {
    render(<HomePage />);
    // Utiliser une classe plus simple à tester
    expect(document.querySelector('[class*="pt-[130px]"]')).toBeInTheDocument();
  });

  test("displays centered content layout", () => {
    render(<HomePage />);
    expect(document.querySelector('.flex.items-center.flex-col.justify-center')).toBeInTheDocument();
  });

  test("contains SVG icons", () => {
    render(<HomePage />);
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  test("has correct text content structure", () => {
    render(<HomePage />);

    // Vérifier que tous les textes principaux sont présents
    expect(screen.getByText(/discover a new experience with/i)).toBeInTheDocument();
    expect(screen.getByText("niato ai. is a chatbot that can help you with your daily tasks.")).toBeInTheDocument();
    expect(screen.getByText("🚀 Chat with GPT-4o-mini for free")).toBeInTheDocument();
    expect(screen.getByText("Try for free")).toBeInTheDocument();
    expect(screen.getByText("Our pricing")).toBeInTheDocument();
  });
});
