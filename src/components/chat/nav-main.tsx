"use client";

import { Ellipsis, MessageSquareText, Trash2, type LucideIcon } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuAction,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { deleteChatById, restoreChat } from "@/app/actions/chat";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const CHAT_SECTIONS = {
    today: "Today",
    yesterday: "Yesterday",
    older: "Older",
} as const;

function getChatBucket(value: string | Date) {
    const date = new Date(value);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const chatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (chatDay.getTime() === today.getTime()) {
        return "today" as const;
    }

    if (chatDay.getTime() === yesterday.getTime()) {
        return "yesterday" as const;
    }

    return "older" as const;
}

export function NavMain({
    items,
}: {
    items: {
        id: string;
        title: string;
        url: string;
        updatedAt: string | Date;
        icon?: LucideIcon;
    }[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { state } = useSidebar();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; url: string } | null>(null);
    const [isDeleting, startDeleting] = useTransition();

    const groupedItems = useMemo(() => {
        return items.reduce(
            (acc, item) => {
                acc[getChatBucket(item.updatedAt)].push(item);
                return acc;
            },
            {
                today: [] as typeof items,
                yesterday: [] as typeof items,
                older: [] as typeof items,
            }
        );
    }, [items]);

    const handleDeleteClick = (item: { id: string; url: string }) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    /**
     * L'ordre des operations compte.
     *
     * Radix pose `pointer-events: none` sur <body> tant qu'une modale est
     * ouverte, et ne le retire qu'a la fermeture. L'ancienne version naviguait
     * puis attendait l'action serveur AVANT d'appeler `setDeleteDialogOpen`.
     * Si l'arbre se demontait entre-temps — ce que provoque la navigation
     * suivie du `revalidatePath` de l'action — le nettoyage de Radix ne
     * s'executait jamais : le style restait sur <body> et toute la page
     * devenait inclickable jusqu'a un rechargement manuel.
     *
     * On ferme donc d'abord, de maniere synchrone, puis on agit.
     */
    const handleDeleteConfirm = () => {
        if (!itemToDelete || isDeleting) return;

        const { id, url } = itemToDelete;

        setDeleteDialogOpen(false);
        setItemToDelete(null);

        startDeleting(async () => {
            try {
                await deleteChatById(id);

                if (pathname === url) {
                    router.push("/chat");
                } else {
                    // Rafraichit la liste laterale, rendue cote serveur.
                    router.refresh();
                }

                toast.success("Chat deleted", {
                    action: {
                        label: "Undo",
                        onClick: async () => {
                            try {
                                await restoreChat(id);
                                router.refresh();
                            } catch {
                                toast.error("Could not restore this conversation.");
                            }
                        },
                    },
                });
            } catch {
                toast.error("Could not delete this conversation.");
            }
        });
    };

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex min-h-0 flex-1 flex-col gap-2">
                <div className={cn("px-2 pt-1 flex items-center gap-3", state === "collapsed" && "sr-only")}>
                    <MessageSquareText className="mt-0.5 size-4 text-sidebar-foreground/60" />
                    <p className="text-sidebar-foreground/70 text-xs font-medium uppercase tracking-wider">
                        Conversations
                    </p>
                </div>

                {state === "expanded" && (
                    <ScrollArea className="h-[calc(100svh-13.5rem)] pr-1 [&_[data-slot=scroll-area-scrollbar]]:hidden">
                        <div className="space-y-4 px-1">
                            {items.length === 0 && (
                                <div className="text-muted-foreground px-3 py-6 text-sm">
                                    No discussion yet. Start a new chat.
                                </div>
                            )}

                            {Object.entries(groupedItems).map(([sectionKey, sectionItems]) => {
                                if (sectionItems.length === 0) {
                                    return null;
                                }

                                return (
                                    <div key={sectionKey} className="space-y-2 pt-3">
                                        <p className="text-sidebar-foreground/60 px-2 pb-1 text-xs font-medium uppercase tracking-wider">
                                            {CHAT_SECTIONS[sectionKey as keyof typeof CHAT_SECTIONS]}
                                        </p>
                                        <SidebarMenu>
                                            {sectionItems.map((item) => (
                                                <SidebarMenuItem key={item.id} className="group/item">
                                                    {/* Une seule ligne, sans horodatage : la date est
                                                        deja portee par l'en-tete de section, et la
                                                        repeter sur chaque entree ajoutait du bruit
                                                        sans information. Le titre complet reste
                                                        accessible en infobulle. */}
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        isActive={pathname === item.url}
                                                        title={item.title}
                                                        className="h-8 cursor-pointer rounded-md pr-8 text-[13px] font-normal data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium"
                                                        onClick={() => router.push(item.url)}
                                                    >
                                                        <span className="truncate">{item.title}</span>
                                                    </SidebarMenuButton>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <SidebarMenuAction showOnHover>
                                                                <Ellipsis size={15} />
                                                                <span className="sr-only">Open chat actions</span>
                                                            </SidebarMenuAction>
                                                        </DropdownMenuTrigger>
                                                        {/* Archive et Pin etaient des `onClick={() => {}}`
                                                            vides : ils donnaient l'illusion d'exister. */}
                                                        <DropdownMenuContent side="right" align="start">
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(item)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 size={15} />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </SidebarGroupContent>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            The conversation will be removed from your list. You can undo this right after.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarGroup>
    );
}
