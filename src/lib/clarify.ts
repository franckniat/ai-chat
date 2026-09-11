import { z } from "zod";

/**
 * Mode « questions d'abord ».
 *
 * Plutot que de repondre immediatement a une demande vague, le modele produit
 * un questionnaire court. Les reponses sont ensuite repliees dans le prompt
 * final, ce qui evite les allers-retours et la premiere reponse a cote.
 */

export const MAX_CLARIFYING_QUESTIONS = 4;
export const MAX_CHOICES_PER_QUESTION = 5;

export const clarifyingQuestionSchema = z.object({
    id: z
        .string()
        .describe("Identifiant court en kebab-case, unique dans le questionnaire"),
    question: z.string().describe("La question, une phrase, sans jargon"),
    /**
     * `text` reste possible mais couteux a remplir : le prompt demande de le
     * reserver aux cas ou aucune liste de choix n'a de sens.
     */
    type: z.enum(["single", "multi", "text"]),
    choices: z
        .array(z.string())
        .max(MAX_CHOICES_PER_QUESTION)
        .describe("Options proposees ; vide pour une question de type text"),
    optional: z
        .boolean()
        .describe("Si vrai, l'utilisateur peut passer la question"),
});

export type ClarifyingQuestion = z.infer<typeof clarifyingQuestionSchema>;

export const clarifyingQuestionsSchema = z.object({
    /**
     * Le modele peut estimer qu'aucune clarification n'est utile : dans ce cas
     * il renvoie une liste vide et le client envoie la demande telle quelle,
     * plutot que d'inventer des questions pour faire nombre.
     */
    questions: z.array(clarifyingQuestionSchema).max(MAX_CLARIFYING_QUESTIONS),
});

export type ClarifyingQuestions = z.infer<typeof clarifyingQuestionsSchema>;

export const clarifySystemPrompt = `You help a user sharpen a request before it is answered.

Read their message and decide what genuinely blocks a precise answer.

Rules:
- Ask at most ${MAX_CLARIFYING_QUESTIONS} questions. Fewer is better.
- If the request is already clear enough to answer well, return an empty list.
- Never ask something the message already answers.
- Prefer "single" or "multi" with concrete choices; use "text" only when no
  sensible list exists.
- Choices must be short, concrete and mutually distinguishable.
- Mark a question optional when a good answer is still possible without it.
- Write in the same language as the user's message.`;

/** Reponse donnee a une question, telle que collectee par le panneau. */
export type ClarifyAnswer = {
    question: string;
    answer: string;
};

/**
 * Assemble la demande initiale et les reponses en un seul prompt.
 *
 * Le resultat est envoye comme un message utilisateur normal : la route de
 * chat n'a pas besoin de connaitre ce mode.
 */
export function buildClarifiedPrompt(
    originalPrompt: string,
    answers: ClarifyAnswer[],
): string {
    const answered = answers.filter((entry) => entry.answer.trim() !== "");
    if (answered.length === 0) return originalPrompt;

    const details = answered
        .map((entry) => `- ${entry.question} → ${entry.answer}`)
        .join("\n");

    return `${originalPrompt}\n\nAdditional context:\n${details}`;
}
