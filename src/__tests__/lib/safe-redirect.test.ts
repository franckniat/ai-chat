import { describe, expect, test } from "vitest";
import { safeRedirect } from "@/lib/safe-redirect";

/**
 * `safeRedirect` garde la page de login : si elle laissait passer une URL
 * absolue, `?next=https://evil.tld` en ferait un tremplin de phishing
 * portant le nom de domaine du produit.
 */
describe("safeRedirect", () => {
    test("laisse passer un chemin interne", () => {
        expect(safeRedirect("/chat")).toBe("/chat");
        expect(safeRedirect("/chat/abc123")).toBe("/chat/abc123");
        expect(safeRedirect("/chat?model=x")).toBe("/chat?model=x");
    });

    test("retombe sur la valeur par defaut quand la cible est absente", () => {
        expect(safeRedirect(null)).toBe("/chat");
        expect(safeRedirect(undefined)).toBe("/chat");
        expect(safeRedirect("")).toBe("/chat");
    });

    test("respecte le fallback fourni", () => {
        expect(safeRedirect(null, "/")).toBe("/");
    });

    test("rejette les URL absolues", () => {
        expect(safeRedirect("https://evil.tld")).toBe("/chat");
        expect(safeRedirect("http://evil.tld/chat")).toBe("/chat");
    });

    test("rejette les URL protocol-relative", () => {
        // `//evil.tld` herite du schema courant : c'est bien une URL externe.
        expect(safeRedirect("//evil.tld")).toBe("/chat");
        expect(safeRedirect("//evil.tld/chat")).toBe("/chat");
    });

    test("rejette la variante backslash", () => {
        // Plusieurs navigateurs normalisent `/\` en `//`.
        expect(safeRedirect("/\\evil.tld")).toBe("/chat");
    });

    test("rejette les schemas exotiques", () => {
        expect(safeRedirect("javascript:alert(1)")).toBe("/chat");
        expect(safeRedirect("data:text/html,<script>")).toBe("/chat");
    });
});
