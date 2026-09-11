"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClarifyAnswer, ClarifyingQuestion } from "@/lib/clarify";

/**
 * Panneau de clarification.
 *
 * Reprend la structure du composant `questionnaire` de shadcn — progression,
 * item, choix, champ libre, actions — mais ecrit a la main : l'item n'est pas
 * publie au registre (`questionnaire.json` repond 404 sur tous les styles),
 * seule sa documentation l'est. Les noms sont conserves pour qu'un
 * remplacement soit mecanique le jour ou il sortira.
 */
export type ClarifyPanelProps = {
    questions: ClarifyingQuestion[];
    /** Envoie la demande enrichie des reponses collectees. */
    onSubmit: (answers: ClarifyAnswer[]) => void;
    /** Envoie la demande initiale sans clarification. */
    onCancel: () => void;
};

type AnswerState = Record<string, string[]>;

export function ClarifyPanel({ questions, onSubmit, onCancel }: ClarifyPanelProps) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<AnswerState>({});
    const [error, setError] = useState<string | null>(null);

    const current = questions[step];
    const isLast = step === questions.length - 1;
    const currentAnswer = useMemo(
        () => answers[current?.id] ?? [],
        [answers, current?.id],
    );

    const setAnswer = useCallback(
        (id: string, value: string[]) => {
            setAnswers((prev) => ({ ...prev, [id]: value }));
            setError(null);
        },
        [],
    );

    const toggleChoice = useCallback(
        (choice: string) => {
            if (!current) return;
            if (current.type === "multi") {
                const next = currentAnswer.includes(choice)
                    ? currentAnswer.filter((entry) => entry !== choice)
                    : [...currentAnswer, choice];
                setAnswer(current.id, next);
                return;
            }
            // Un second clic sur le meme choix le deselectionne : sans cela, on
            // ne peut plus revenir en arriere sur une question facultative.
            setAnswer(current.id, currentAnswer[0] === choice ? [] : [choice]);
        },
        [current, currentAnswer, setAnswer],
    );

    const collect = useCallback((): ClarifyAnswer[] => {
        return questions.map((question) => ({
            question: question.question,
            answer: (answers[question.id] ?? []).join(", "),
        }));
    }, [answers, questions]);

    const goNext = useCallback(() => {
        if (!current) return;

        if (!current.optional && currentAnswer.length === 0) {
            setError("Pick an answer, or mark it skipped below.");
            return;
        }

        setError(null);
        if (isLast) {
            onSubmit(collect());
            return;
        }
        setStep((value) => value + 1);
    }, [collect, current, currentAnswer.length, isLast, onSubmit]);

    const skip = useCallback(() => {
        if (!current) return;
        setAnswer(current.id, []);
        setError(null);
        if (isLast) {
            onSubmit(collect());
            return;
        }
        setStep((value) => value + 1);
    }, [collect, current, isLast, onSubmit, setAnswer]);

    if (!current) return null;

    return (
        <section
            aria-label="Clarifying questions"
            className="bg-card mb-2 rounded-2xl border p-4 shadow-sm"
        >
            {/* QuestionnaireProgress */}
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Question {step + 1} of {questions.length}
                </p>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={onCancel}
                    aria-label="Answer without clarifying"
                >
                    <X className="size-4" />
                </Button>
            </div>

            <div className="bg-muted mb-4 h-1 overflow-hidden rounded-full">
                <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* QuestionnaireItem */}
            <div className="space-y-3">
                <h3 className="text-[15px] leading-snug font-medium">
                    {current.question}
                    {current.optional && (
                        <span className="text-muted-foreground ml-2 text-xs font-normal">
                            optional
                        </span>
                    )}
                </h3>

                {current.type === "text" ? (
                    <Input
                        autoFocus
                        value={currentAnswer[0] ?? ""}
                        onChange={(event) => setAnswer(current.id, [event.target.value])}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                goNext();
                            }
                        }}
                        placeholder="Your answer"
                    />
                ) : (
                    /* QuestionnaireChoices */
                    <div className="flex flex-wrap gap-2">
                        {current.choices.map((choice) => {
                            const selected = currentAnswer.includes(choice);
                            return (
                                <button
                                    key={choice}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => toggleChoice(choice)}
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                                        selected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "hover:bg-accent",
                                    )}
                                >
                                    {selected && <Check className="size-3.5" />}
                                    {choice}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* QuestionnaireError */}
                {error && <p className="text-destructive text-xs">{error}</p>}
            </div>

            {/* QuestionnaireActions */}
            <div className="mt-4 flex items-center justify-between gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep((value) => Math.max(0, value - 1))}
                    disabled={step === 0}
                >
                    <ArrowLeft className="mr-1 size-4" />
                    Back
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={skip}>
                        Skip
                    </Button>
                    <Button size="sm" onClick={goNext}>
                        {isLast ? (
                            <>
                                Send
                                <Send className="ml-1 size-4" />
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight className="ml-1 size-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
}
