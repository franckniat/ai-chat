export type ModelCategory = "Elite" | "Solide" | "Leger";

export interface RankedModel {
    /** Identifiant tel qu'attendu par l'API Gemini. */
    id: string;
    name: string;
    chef: string;
    /** Slug de logo pour models.dev. */
    chefSlug: string;
    providers: string[];
    /**
     * Le modele expose-t-il sa chaine de raisonnement ?
     *
     * Vrai uniquement pour les Gemini, pour lesquels la route active
     * `thinkingConfig.includeThoughts`. Les Gemma ne produisent pas de
     * « thoughts » : annoncer l'inverse afficherait un panneau vide.
     */
    isReasoning: boolean;
    popularityRank: number;
    performanceRank: number;
    category: ModelCategory;
}

/**
 * Catalogue Google, restreint aux modeles du palier gratuit.
 *
 * Chaque identifiant a ete verifie contre l'API Gemini : les modeles Pro
 * (gemini-2.5-pro, gemini-pro-latest, gemini-3.1-pro-preview...) repondent
 * 429 « You exceeded your current quota, please check your plan and billing
 * details » et sont donc volontairement absents. `gemini-2.5-flash-lite`
 * repond 404 (« no longer available to new users ») et l'est aussi.
 *
 * Pour verifier a nouveau apres une evolution de l'offre Google, une requete
 * `generateContent` avec `maxOutputTokens: 1` suffit a distinguer un modele
 * accessible d'un modele facture.
 */
export const GOOGLE_MODELS: RankedModel[] = [
    {
        id: "gemini-3.8-flash",
        name: "Gemini 3.8 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 1,
        performanceRank: 1,
        category: "Elite",
    },
    {
        id: "gemini-3.7-flash",
        name: "Gemini 3.7 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 2,
        performanceRank: 2,
        category: "Elite",
    },
    {
        id: "gemini-3.6-flash",
        name: "Gemini 3.6 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 3,
        performanceRank: 3,
        category: "Elite",
    },
    {
        id: "gemini-3.5-flash",
        name: "Gemini 3.5 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 4,
        performanceRank: 4,
        category: "Solide",
    },
    {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 5,
        performanceRank: 5,
        category: "Solide",
    },
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 6,
        performanceRank: 6,
        category: "Solide",
    },
    {
        id: "gemini-3.5-flash-lite",
        name: "Gemini 3.5 Flash Lite",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 7,
        performanceRank: 7,
        category: "Leger",
    },
    {
        id: "gemini-3.1-flash-lite",
        name: "Gemini 3.1 Flash Lite",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: true,
        popularityRank: 8,
        performanceRank: 8,
        category: "Leger",
    },
    {
        id: "gemma-4-31b-it",
        name: "Gemma 4 31B",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: false,
        popularityRank: 9,
        performanceRank: 9,
        category: "Leger",
    },
    {
        id: "gemma-4-26b-a4b-it",
        name: "Gemma 4 26B",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: false,
        popularityRank: 10,
        performanceRank: 10,
        category: "Leger",
    },
];

export const MODEL_IDS = GOOGLE_MODELS.map((model) => model.id);

export const DEFAULT_MODEL_ID = GOOGLE_MODELS[0].id;

export function getModelById(id: string) {
    return GOOGLE_MODELS.find((model) => model.id === id);
}
