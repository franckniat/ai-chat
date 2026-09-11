import { defaultSchema } from "rehype-sanitize";

/**
 * Schema de sanitisation applique au markdown produit par le modele.
 *
 * `rehype-raw` reinjecte le HTML brut present dans la reponse dans le DOM. Sans
 * filtrage, une reponse contenant `<img onerror=...>` ou `<script>` s'execute
 * dans la page — surface d'injection classique quand le modele lit une source
 * externe (fichier envoye, page web).
 *
 * A brancher APRES `rehypeRaw` et AVANT `rehypeKatex`, pour que le balisage
 * genere par KaTeX ne soit pas retire a son tour.
 */
export const markdownSanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        // Les classes `language-*` pilotent la coloration syntaxique,
        // `math-inline` / `math-display` sont produites par remark-math.
        code: [
            ...(defaultSchema.attributes?.code ?? []),
            ["className", /^language-./, "math-inline", "math-display"],
        ],
        span: [...(defaultSchema.attributes?.span ?? []), "className"],
        div: [...(defaultSchema.attributes?.div ?? []), "className"],
        pre: [...(defaultSchema.attributes?.pre ?? []), "className"],
    },
};
