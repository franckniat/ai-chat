export type ModelCategory = "Budget" | "Balanced" | "Advanced";

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
     * Vrai uniquement quand `thinkingBudget` est superieur a zero : sinon le
     * panneau de raisonnement resterait vide.
     */
    isReasoning: boolean;
    /**
     * Budget de reflexion envoye a l'API.
     *
     * `undefined` : le modele rejette le parametre (Flash-Lite, Gemma) et ne
     *               reflechit pas — c'est le cas le moins cher.
     * `0`         : reflexion desactivee explicitement.
     * `-1`        : budget dynamique, laisse au modele.
     *
     * Un budget fixe intermediaire ne sert a rien : mesure sur
     * gemini-3.8-flash, `thinkingBudget: 512` produit 0 token de reflexion —
     * sous le minimum du modele, la valeur se comporte comme zero — tandis que
     * 4096 en produit 659. Il n'existe donc pas de reflexion « bon marche » :
     * c'est ~104 tokens sans, ~770 avec.
     */
    thinkingBudget?: number;
    /** 1 = le moins cher a l'usage. Sert a ordonner la bascule automatique. */
    costRank: number;
    category: ModelCategory;
}

/**
 * Catalogue Google, choisi pour le rapport capacite / cout.
 *
 * Deux constats mesures contre l'API, a garder en tete avant d'y toucher :
 *
 * 1. Les modeles Pro (gemini-2.5-pro, gemini-pro-latest, gemini-3.1-pro-*)
 *    repondent 429 « check your plan and billing details » meme avec un
 *    abonnement actif. Ils sont donc absents, et seraient de toute facon les
 *    plus chers.
 *
 * 2. La reflexion coute tres cher. Sur gemini-3.8-flash, une question de
 *    trois phrases produit 584 tokens de « thoughts » pour 103 tokens de
 *    reponse — 700 au total contre 104 avec `thinkingBudget: 0`, soit 6,7x.
 *    Les tokens de reflexion sont factures au tarif de sortie, le plus eleve.
 *    Elle est donc coupee partout, sauf sur le seul palier « Advanced » ou
 *    elle reste disponible a la demande, nom du modele a l'appui.
 *
 * L'ordre de la liste est l'ordre de repli automatique : du moins cher au
 * plus capable, pour qu'une saturation ne fasse jamais grimper la facture.
 */
export const GOOGLE_MODELS: RankedModel[] = [
    {
        id: "gemini-3.5-flash-lite",
        name: "Gemini 3.5 Flash Lite",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: false,
        costRank: 1,
        category: "Budget",
    },
    {
        id: "gemini-3.1-flash-lite",
        name: "Gemini 3.1 Flash Lite",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: false,
        costRank: 2,
        category: "Budget",
    },
    {
        id: "gemma-4-31b-it",
        name: "Gemma 4 31B",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: false,
        costRank: 3,
        category: "Budget",
    },
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: false,
        thinkingBudget: 0,
        costRank: 4,
        category: "Balanced",
    },
    {
        id: "gemini-3.5-flash",
        name: "Gemini 3.5 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        isReasoning: false,
        thinkingBudget: 0,
        costRank: 5,
        category: "Balanced",
    },
    {
        id: "gemini-3.8-flash",
        name: "Gemini 3.8 Flash (Thinking)",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
        // Seul modele du catalogue qui reflechit, et le seul dont le panneau
        // de raisonnement affiche quelque chose. Son nom porte la mention
        // « Thinking » pour que le surcout soit un choix conscient : environ
        // sept fois le cout d'une reponse sans reflexion.
        isReasoning: true,
        thinkingBudget: -1,
        costRank: 6,
        category: "Advanced",
    },
];

export const MODEL_IDS = GOOGLE_MODELS.map((model) => model.id);

/** Le moins cher du catalogue : c'est lui qu'on sert par defaut. */
export const DEFAULT_MODEL_ID = GOOGLE_MODELS[0].id;

/** Modele utilise pour generer les titres de conversation. */
export const TITLE_MODEL_ID = GOOGLE_MODELS[0].id;

export function getModelById(id: string) {
    return GOOGLE_MODELS.find((model) => model.id === id);
}
