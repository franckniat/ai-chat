/**
 * Nettoie une destination de redirection issue de l'URL.
 *
 * Deux problemes traites :
 *  - `router.push()` suit les URL absolues : `?next=https://evil.tld` transforme
 *    la page de login en tremplin de phishing (open redirect).
 *  - `//evil.tld` est une URL protocol-relative, donc egalement externe malgre
 *    son slash initial.
 *
 * Seuls les chemins internes ("/quelque-chose") sont acceptes.
 */
export function safeRedirect(
    target: string | null | undefined,
    fallback = "/chat",
): string {
    if (!target) return fallback;
    if (!target.startsWith("/")) return fallback;
    if (target.startsWith("//")) return fallback;
    // `/\` est traite comme `//` par certains navigateurs.
    if (target.startsWith("/\\")) return fallback;
    return target;
}

/** Nom du parametre de retour, partage par les redirections et les formulaires. */
export const REDIRECT_PARAM = "next";
