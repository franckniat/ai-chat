"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { ChatContext } from "./chat-context";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import FormChat from "./form-chat";
import { DefaultChatTransport, type UIMessage } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import { GOOGLE_MODELS } from "@/lib/google-models";
import {
    buildClarifiedPrompt,
    type ClarifyAnswer,
    type ClarifyingQuestion,
} from "@/lib/clarify";
import { ClarifyPanel } from "./clarify-panel";
import {
    readPreferredModel,
    readPreferredPersonality,
    writePreferredModel,
    writePreferredPersonality,
} from "@/lib/chat-preferences";

export const models = GOOGLE_MODELS;

const MAX_AUTO_FALLBACK_ATTEMPTS = 2;

function isRateLimitedError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error ?? "");
    return /429|rate[- ]?limit|temporarily rate-limited|retry shortly/i.test(message);
}

/**
 * Modele de repli en cas de saturation.
 *
 * Le catalogue est trie du moins cher au plus capable : on remonte donc d'un
 * cran, jamais plus, pour qu'une saturation ne fasse pas grimper la facture.
 */
function getNextModelId(currentModelId: string) {
    const currentIndex = models.findIndex((model) => model.id === currentModelId);
    if (currentIndex === -1 || currentIndex >= models.length - 1) {
        return null;
    }
    return models[currentIndex + 1]?.id ?? null;
}

// Type pour les métadonnées des messages
interface MessageMetadata {
    chatId?: string;
    isNewChat?: boolean;
    isComplete?: boolean;
}

export default function ChatProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [chatId, setChatId] = useState<string | null>(null);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
    // Mode « questions d'abord » et questionnaire en cours.
    const [clarifyMode, setClarifyMode] = useState(false);
    const [isClarifying, setIsClarifying] = useState(false);
    const [pendingClarification, setPendingClarification] = useState<{
        prompt: string;
        questions: ClarifyingQuestion[];
    } | null>(null);
    // Initialiseurs paresseux : localStorage n'existe pas au rendu serveur, et
    // `useState(fn)` n'appelle `fn` qu'au premier rendu client.
    const [selectedModel, setSelectedModelState] = useState<string>(models[0].id);
    const selectedModelData = models.find((model) => model.id === selectedModel);
    const [input, setInput] = useState("");
    const [model, setModel] = useState<string>(models[0].id);
    const [selectedPersonality, setSelectedPersonalityState] = useState<string>("default");

    // Restaure les preferences apres l'hydratation. Les lire pendant le rendu
    // ferait diverger le HTML serveur du HTML client.
    useEffect(() => {
        setSelectedModelState(readPreferredModel());
        setSelectedPersonalityState(readPreferredPersonality());
    }, []);

    // Tout changement depuis le composeur devient la nouvelle preference : le
    // modele ne repart plus au defaut a chaque navigation.
    const setSelectedModel = useCallback((next: string) => {
        setSelectedModelState(next);
        writePreferredModel(next);
    }, []);

    const setSelectedPersonality = useCallback((next: string) => {
        setSelectedPersonalityState(next);
        writePreferredPersonality(next);
    }, []);
    const selectedModelRef = useRef(selectedModel);
    const selectedPersonalityRef = useRef(selectedPersonality);
    const chatIdRef = useRef<string | null>(chatId);
    const fallbackAttemptsRef = useRef(0);
    const regenerateRef = useRef<((options?: { body?: Record<string, unknown> }) => void) | null>(null);

    useEffect(() => {
        selectedModelRef.current = selectedModel;
    }, [selectedModel]);

    useEffect(() => {
        selectedPersonalityRef.current = selectedPersonality;
    }, [selectedPersonality]);

    useEffect(() => {
        chatIdRef.current = chatId;
    }, [chatId]);

    const {
        regenerate: originalRegenerate,
        messages,
        sendMessage,
        status,
        stop,
        error,
        setMessages,
    } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
        onError: (error) => {
            if (isRateLimitedError(error) && fallbackAttemptsRef.current < MAX_AUTO_FALLBACK_ATTEMPTS) {
                const currentModelId = selectedModelRef.current;
                const nextModelId = getNextModelId(currentModelId);

                if (nextModelId && regenerateRef.current) {
                    fallbackAttemptsRef.current += 1;
                    setSelectedModelState(nextModelId);

                    const currentModelName = models.find((model) => model.id === currentModelId)?.name ?? currentModelId;
                    const nextModelName = models.find((model) => model.id === nextModelId)?.name ?? nextModelId;

                    toast.warning(
                        `${currentModelName} est limite temporairement. Reprise automatique avec ${nextModelName}...`
                    );

                    regenerateRef.current({
                        body: {
                            chatId: chatIdRef.current,
                            modelId: nextModelId,
                            personality: selectedPersonalityRef.current,
                        },
                    });
                    return;
                }
            }

            if (error instanceof ChatSDKError) {
                toast.error(error.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
            setIsCreatingChat(false);
        },
        onFinish: ({ message }) => {
            fallbackAttemptsRef.current = 0;

            // Refresh sidebar after generation is complete
            const metadata = message.metadata as MessageMetadata | undefined;
            if (metadata?.isComplete) {
                router.refresh();
            }
            setIsCreatingChat(false);
        },
        experimental_throttle: 50, // Throttle UI updates for performance
    });

    useEffect(() => {
        regenerateRef.current = originalRegenerate as (options?: { body?: Record<string, unknown> }) => void;
    }, [originalRegenerate]);

    // Detect new chat and redirect immediately when first assistant message arrives
    useEffect(() => {
        if (isCreatingChat && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "assistant") {
                const metadata = lastMessage.metadata as MessageMetadata | undefined;
                if (metadata?.chatId && metadata?.isNewChat) {
                    setChatId(metadata.chatId);
                    router.push(`/chat/${metadata.chatId}`);
                    setIsCreatingChat(false);
                }
            }
        }
    }, [messages, isCreatingChat, router]);

    // Reset isCreatingChat when streaming starts
    useEffect(() => {
        if (status === "streaming" && isCreatingChat) {
            // Garder isCreatingChat true jusqu'à onFinish
        }
    }, [status, isCreatingChat]);

    // Synchroniser le chatId avec le pathname
    useEffect(() => {
        const pathChatId = pathname.match(/\/chat\/([^/]+)/)?.[1];
        if (pathChatId && pathChatId !== chatId) {
            setChatId(pathChatId);
        } else if (pathname === "/chat" && chatId) {
            setChatId(null);
        }
    }, [pathname, chatId]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }, []);

    /** Envoi effectif vers /api/chat, une fois le texte final connu. */
    const dispatch = useCallback(
        (text: string, files?: PromptInputMessage["files"]) => {
            fallbackAttemptsRef.current = 0;
            if (!chatId) {
                setIsCreatingChat(true);
            }
            sendMessage(
                { text, files },
                {
                    body: {
                        chatId,
                        modelId: selectedModel,
                        personality: selectedPersonality,
                    },
                }
            );
        },
        [chatId, selectedModel, selectedPersonality, sendMessage]
    );

    const handleSubmit = useCallback(
        async (message: PromptInputMessage) => {
            const text = input;
            const files = message.files;
            const hasText = Boolean(text.trim());
            const hasAttachments = Boolean(files?.length);
            if (!(hasText || hasAttachments)) {
                return;
            }

            setInput("");

            // Mode « questions d'abord » : on demande un questionnaire court
            // avant de repondre. Une piece jointe rend l'exercice inutile —
            // le fichier porte deja le contexte — et le modele peut estimer
            // qu'aucune question n'est utile, auquel cas on envoie directement.
            if (clarifyMode && hasText && !hasAttachments) {
                setIsClarifying(true);
                try {
                    const response = await fetch("/api/chat/clarify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: text }),
                    });
                    const payload = (await response.json()) as {
                        questions?: ClarifyingQuestion[];
                    };

                    if (payload.questions?.length) {
                        setPendingClarification({ prompt: text, questions: payload.questions });
                        return;
                    }
                } catch {
                    // Le mode est une aide, pas une dependance : en cas
                    // d'echec on envoie la demande telle quelle.
                } finally {
                    setIsClarifying(false);
                }
            }

            dispatch(text, files);
        },
        [clarifyMode, dispatch, input]
    );

    /** Replie les reponses dans le prompt et envoie. */
    const submitClarification = useCallback(
        (answers: ClarifyAnswer[]) => {
            if (!pendingClarification) return;
            const enriched = buildClarifiedPrompt(pendingClarification.prompt, answers);
            setPendingClarification(null);
            dispatch(enriched);
        },
        [dispatch, pendingClarification]
    );

    /** Abandonne les questions et envoie la demande initiale. */
    const cancelClarification = useCallback(() => {
        if (!pendingClarification) return;
        const original = pendingClarification.prompt;
        setPendingClarification(null);
        dispatch(original);
    }, [dispatch, pendingClarification]);

    // Wrapper pour regenerate qui inclut le chatId et le modèle
    const regenerate = useCallback(() => {
        fallbackAttemptsRef.current = 0;

        if (chatId) {
            originalRegenerate({
                body: {
                    chatId: chatId,
                    modelId: selectedModel,
                    personality: selectedPersonality,
                },
            });
        } else {
            originalRegenerate();
        }
    }, [chatId, selectedModel, selectedPersonality, originalRegenerate]);

    return (
        <ChatContext.Provider
            value={{
                selectedModel,
                setSelectedModel,
                selectedModelData,
                useWebSearch,
                setUseWebSearch,
                setModel,
                messages,
                model,
                input,
                handleSubmit,
                handleInputChange,
                status,
                regenerate,
                stop,
                setMessages,
                setChatId,
                chatId,
                isCreatingChat,
                setIsCreatingChat,
                error,
                selectedPersonality,
                setSelectedPersonality,
                clarifyMode,
                setClarifyMode,
                isClarifying,
            }}
        >
            {/* `min-h-0` laisse la zone de messages retrecir et defiler ;
                le composeur reste colle en bas sans `position: fixed`. */}
            <div className="flex min-h-0 w-full flex-1 flex-col">
                <div className="flex min-h-0 flex-1 flex-col">{children}</div>
                {pendingClarification && (
                    <div className="mx-auto w-full max-w-3xl shrink-0 px-4">
                        <ClarifyPanel
                            questions={pendingClarification.questions}
                            onSubmit={submitClarification}
                            onCancel={cancelClarification}
                        />
                    </div>
                )}
                <FormChat
                    name="prompt"
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={status === "streaming" || status === "submitted" || isCreatingChat}
                    stop={stop}
                />
            </div>
        </ChatContext.Provider>
    );
}

