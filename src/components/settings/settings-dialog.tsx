"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Check, Loader2, Monitor, Moon, Sun } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { authClient, useSession } from "@/lib/auth-client";
import { GOOGLE_MODELS } from "@/lib/google-models";
import { personalities } from "@/lib/personalities";
import {
    readPreferredModel,
    readPreferredPersonality,
    serverPreferredModel,
    serverPreferredPersonality,
    subscribePreferences,
    writePreferredModel,
    writePreferredPersonality,
} from "@/lib/chat-preferences";
import { cn } from "@/lib/utils";

/**
 * Parametres, ouverts et fermes par l'URL.
 *
 * `?settings=<onglet>` porte l'etat : le panneau survit a un rechargement, se
 * partage par lien, et le bouton Retour du navigateur le referme au lieu de
 * quitter la page.
 */
export const SETTINGS_PARAM = "settings";

const TABS = ["account", "appearance", "chat"] as const;
type SettingsTab = (typeof TABS)[number];

const DEFAULT_TAB: SettingsTab = "account";

function isSettingsTab(value: string | null): value is SettingsTab {
    return value !== null && (TABS as readonly string[]).includes(value);
}

/** Construit le lien d'ouverture, a utiliser depuis un menu ou un bouton. */
export function settingsHref(tab: SettingsTab = DEFAULT_TAB) {
    return `?${SETTINGS_PARAM}=${tab}`;
}

export function SettingsDialog() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const rawTab = searchParams.get(SETTINGS_PARAM);
    const open = rawTab !== null;
    // Une valeur inconnue dans l'URL ouvre quand meme, sur l'onglet par defaut,
    // plutot que d'afficher un panneau vide.
    const tab: SettingsTab = isSettingsTab(rawTab) ? rawTab : DEFAULT_TAB;

    const setTab = useCallback(
        (next: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(SETTINGS_PARAM, next);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams],
    );

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (nextOpen) return;
            const params = new URLSearchParams(searchParams.toString());
            params.delete(SETTINGS_PARAM);
            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        },
        [pathname, router, searchParams],
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="gap-0 p-0 sm:max-w-xl">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account and how the chat behaves.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="mx-6 w-[calc(100%-3rem)]">
                        <TabsTrigger value="account" className="flex-1">
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex-1">
                            Appearance
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex-1">
                            Chat
                        </TabsTrigger>
                    </TabsList>

                    <div className="px-6 pt-5 pb-6">
                        <TabsContent value="account" className="mt-0">
                            <AccountSettings />
                        </TabsContent>
                        <TabsContent value="appearance" className="mt-0">
                            <AppearanceSettings />
                        </TabsContent>
                        <TabsContent value="chat" className="mt-0">
                            <ChatSettings />
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

function AccountSettings() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    // `user` arrive de maniere asynchrone : on initialise le champ des qu'il
    // est la, sans ecraser une saisie en cours.
    useEffect(() => {
        if (user?.name) {
            setName((current) => (current === "" ? user.name : current));
        }
    }, [user?.name]);

    if (isPending) {
        return (
            <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
                <Loader2 className="size-4 animate-spin" />
                Loading your account…
            </div>
        );
    }

    if (!user) {
        return (
            <p className="text-muted-foreground py-8 text-sm">
                You need to be signed in to change these settings.
            </p>
        );
    }

    const dirty = name.trim() !== "" && name.trim() !== user.name;

    const handleSave = async () => {
        if (!dirty || saving) return;
        setSaving(true);
        try {
            const { error } = await authClient.updateUser({ name: name.trim() });
            if (error) throw new Error(error.message ?? "Update failed");
            toast.success("Display name updated");
            router.refresh();
        } catch {
            toast.error("Could not update your display name.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="settings-name">Display name</Label>
                <Input
                    id="settings-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    disabled={saving}
                />
                <p className="text-muted-foreground text-xs">
                    Shown in the sidebar and used to greet you.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <div className="flex items-center gap-2">
                    <Input id="settings-email" value={user.email} readOnly disabled />
                    {user.emailVerified ? (
                        <Badge variant="secondary" className="shrink-0 gap-1">
                            <Check className="size-3" />
                            Verified
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="shrink-0">
                            Unverified
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground text-xs">
                    Changing your email is not available yet — contact support if you need it.
                </p>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={!dirty || saving}>
                    {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Save changes
                </Button>
            </div>
        </div>
    );
}

const THEMES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
] as const;

function AppearanceSettings() {
    // `theme` est indefini tant que next-themes n'a pas lu le stockage : aucune
    // carte n'est alors marquee active, ce qui est le rendu correct. Un flag
    // `mounted` pose dans un effet ferait un setState en cascade pour le meme
    // resultat.
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2">
                {THEMES.map(({ value, label, icon: Icon }) => {
                    const active = theme === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setTheme(value)}
                            aria-pressed={active}
                            className={cn(
                                "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors",
                                active
                                    ? "border-primary bg-accent text-accent-foreground"
                                    : "hover:bg-accent/50",
                            )}
                        >
                            <Icon className="size-5" />
                            {label}
                        </button>
                    );
                })}
            </div>
            <p className="text-muted-foreground text-xs">
                System follows your operating system setting.
            </p>
        </div>
    );
}

function ChatSettings() {
    // localStorage est une source exterieure a React : `useSyncExternalStore`
    // la lit sans effet ni setState, et son snapshot serveur evite toute
    // divergence d'hydratation.
    const model = useSyncExternalStore(
        subscribePreferences,
        readPreferredModel,
        serverPreferredModel,
    );
    const personality = useSyncExternalStore(
        subscribePreferences,
        readPreferredPersonality,
        serverPreferredPersonality,
    );

    const handleModel = (value: string) => {
        writePreferredModel(value);
        toast.success("Default model saved");
    };

    const handlePersonality = (value: string) => {
        writePreferredPersonality(value);
        toast.success("Default tone saved");
    };

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Label>Default model</Label>
                <Select value={model} onValueChange={handleModel}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Loading…" />
                    </SelectTrigger>
                    <SelectContent>
                        {GOOGLE_MODELS.map((entry) => (
                            <SelectItem key={entry.id} value={entry.id}>
                                <span className="flex items-center gap-2">
                                    {entry.name}
                                    <span className="text-muted-foreground text-xs">
                                        {entry.category}
                                    </span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                    Used for new conversations. You can still switch model at any time from the
                    composer.
                </p>
            </div>

            <div className="space-y-2">
                <Label>Default tone</Label>
                <Select value={personality} onValueChange={handlePersonality}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Loading…" />
                    </SelectTrigger>
                    <SelectContent>
                        {personalities.map((entry) => (
                            <SelectItem key={entry.id} value={entry.id}>
                                <span className="flex items-center gap-2">
                                    <span className="text-base leading-none">{entry.icon}</span>
                                    {entry.name}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                    {personalities.find((entry) => entry.id === personality)?.description}
                </p>
            </div>
        </div>
    );
}
