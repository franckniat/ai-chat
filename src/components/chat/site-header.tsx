"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type ChatSearchResult = {
    id: string;
    title: string;
    updatedAt: string;
};

export function SiteHeader() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ChatSearchResult[]>([]);

    useEffect(() => {
        const onShortcut = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        window.addEventListener("keydown", onShortcut);
        return () => window.removeEventListener("keydown", onShortcut);
    }, []);

    useEffect(() => {
        if (!open) {
            setQuery("");
            setResults([]);
            setLoading(false);
            return;
        }

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setResults([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/chat/search?q=${encodeURIComponent(trimmedQuery)}`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    setResults([]);
                    return;
                }

                const payload = (await response.json()) as { items: ChatSearchResult[] };
                setResults(payload.items ?? []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [open, query]);

    const resultLabel = useMemo(() => {
        if (!query.trim()) {
            return "Type to search your conversations";
        }
        if (loading) {
            return "Searching...";
        }
        return "No matching conversation found";
    }, [loading, query]);

    const openChat = (chatId: string) => {
        setOpen(false);
        setQuery("");
        router.push(`/chat/${chatId}`);
    };

    return (
        <>
            <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                <div className="flex w-full items-center justify-between gap-2 px-4 lg:px-6">
                    <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                        <p className="text-muted-foreground hidden text-sm md:block">
                            Conversations
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="text-muted-foreground h-9 gap-2 px-3"
                            onClick={() => setOpen(true)}
                        >
                            <Search className="size-4" />
                            <span className="hidden sm:inline">Search chats</span>
                            <span className="text-muted-foreground/80 hidden rounded-sm border px-1.5 text-[11px] sm:inline">
                                Ctrl K
                            </span>
                        </Button>

                        <Button
                            className="relative size-9"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setTheme(theme === "dark" ? "light" : "dark");
                            }}
                        >
                            <Sun className="absolute size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:rotate-12" />
                            <Moon className="size-4 scale-0 rotate-12 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
            </header>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                title="Search conversation"
                description="Search inside your chat history"
                className="sm:max-w-2xl"
            >
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Find by title or message content..."
                />
                <CommandList>
                    <CommandEmpty>{resultLabel}</CommandEmpty>
                    {results.length > 0 && (
                        <CommandGroup heading="Conversations">
                            {results.map((chat) => (
                                <CommandItem
                                    key={chat.id}
                                    value={`${chat.title}-${chat.id}-${query}`}
                                    onSelect={() => openChat(chat.id)}
                                    className="flex items-start justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm">{chat.title}</p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Updated {new Date(chat.updatedAt).toLocaleString("en", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </CommandItem>
                            ))}
                            <CommandSeparator />
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
