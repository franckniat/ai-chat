import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/authz";
import { TITLE_MODEL_ID } from "@/lib/google-models";
import { clarifySystemPrompt, clarifyingQuestionsSchema } from "@/lib/clarify";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 30;

/** Au-dela, la demande est assez detaillee pour se passer de clarification. */
const MAX_PROMPT_CHARS = 4_000;

/**
 * Genere un questionnaire court a partir d'une demande.
 *
 * Cout : un appel supplementaire sur le modele le moins cher du catalogue,
 * avec une sortie bornee. C'est le prix a payer pour eviter un aller-retour
 * complet sur une premiere reponse hors sujet.
 */
export async function POST(req: Request) {
    const session = await getCurrentSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let prompt: unknown;
    try {
        ({ prompt } = await req.json());
    } catch {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    if (typeof prompt !== "string" || prompt.trim() === "") {
        return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    try {
        const result = await generateObject({
            model: google(TITLE_MODEL_ID),
            schema: clarifyingQuestionsSchema,
            system: clarifySystemPrompt,
            prompt: prompt.slice(0, MAX_PROMPT_CHARS),
            temperature: 0.2,
            maxOutputTokens: 600,
        });

        return NextResponse.json(result.object);
    } catch (error) {
        // Un echec ici ne doit pas bloquer l'utilisateur : le client envoie
        // alors la demande telle quelle, sans clarification.
        console.error("clarify: generation failed", error);
        return NextResponse.json({ questions: [] });
    }
}
