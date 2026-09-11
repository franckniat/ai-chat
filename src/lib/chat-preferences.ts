import { DEFAULT_MODEL_ID, getModelById } from "@/lib/google-models";
import { getPersonalityById } from "@/lib/personalities";

/**
 * Preferences de chat conservees dans le navigateur.
 *
 * Le modele et la tonalite etaient de simples `useState` dans ChatProvider :
 * ils revenaient au defaut a chaque navigation et a chaque rechargement.
 * Ici ils survivent a la session, et les Parametres les exposent.
 *
 * localStorage plutot que la base : ce sont des preferences d'affichage, pas
 * des donnees de compte, et on evite un aller-retour serveur au montage.
 */
const MODEL_KEY = "niato.chat.model";
const PERSONALITY_KEY = "niato.chat.personality";

function read(key: string): string | null {
    // Un acces a localStorage peut lever (navigation privee, cookies bloques,
    // capture de miniature) : jamais sans garde.
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

function write(key: string, value: string) {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        /* preference non persistee, sans consequence sur la session courante */
    }
}

/**
 * Abonnement pour `useSyncExternalStore`.
 *
 * Lire localStorage dans un `useEffect` puis appeler setState declenche un
 * rendu en cascade (react-hooks/set-state-in-effect). `useSyncExternalStore`
 * est le primitif prevu pour une source exterieure a React, et gere le
 * couple snapshot serveur / snapshot client sans divergence d'hydratation.
 *
 * `storage` ne se declenche que dans les AUTRES onglets ; les ecritures
 * locales notifient donc les abonnes explicitement.
 */
const listeners = new Set<() => void>();

function notify() {
    for (const listener of listeners) listener();
}

export function subscribePreferences(listener: () => void) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
}

/** Modele par defaut, valide contre le catalogue courant. */
export function readPreferredModel(): string {
    const stored = read(MODEL_KEY);
    // Un modele retire du catalogue ne doit pas bloquer l'utilisateur.
    return stored && getModelById(stored) ? stored : DEFAULT_MODEL_ID;
}

export function writePreferredModel(modelId: string) {
    write(MODEL_KEY, modelId);
    notify();
}

/** Snapshot serveur : pas de localStorage, on renvoie le defaut. */
export function serverPreferredModel() {
    return DEFAULT_MODEL_ID;
}

/** Tonalite par defaut, validee contre la liste des personnalites. */
export function readPreferredPersonality(): string {
    const stored = read(PERSONALITY_KEY);
    return stored && getPersonalityById(stored).id === stored ? stored : "default";
}

export function writePreferredPersonality(personalityId: string) {
    write(PERSONALITY_KEY, personalityId);
    notify();
}

export function serverPreferredPersonality() {
    return "default";
}
