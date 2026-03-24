"use client";

import { Archive, Ellipsis, MessageSquareText, Pin, Trash2, type LucideIcon } from "lucide-react";

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
import { useMemo, useState } from "react";
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

function formatChatTime(value: string | Date) {
    return new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
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

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        if (pathname === itemToDelete.url) {
            router.push("/chat");
        }
        await deleteChatById(itemToDelete.id);
        toast.success("Chat deleted", {
            description: "The chat has been successfully deleted.",
            action: {
                label: "Cancel",
                onClick: () => {
                    restoreChat(itemToDelete.id);
                },
            },
        });
        setDeleteDialogOpen(false);
        setItemToDelete(null);
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
                                        <p className="text-sidebar-foreground/60 px-2 pb-1 text-[11px] font-medium uppercase tracking-wider">
                                            {CHAT_SECTIONS[sectionKey as keyof typeof CHAT_SECTIONS]}
                                        </p>
                                        <SidebarMenu>
                                            {sectionItems.map((item) => (
                                                <SidebarMenuItem key={item.id} className="group/item">
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        isActive={pathname === item.url}
                                                        title={item.title}
                                                        className="h-11 cursor-pointer items-start rounded-lg border border-transparent py-2 data-[active=true]:border-sidebar-border/60 data-[active=true]:bg-sidebar-accent/70"
                                                        onClick={() => router.push(item.url)}
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="line-clamp-1 text-sm leading-tight">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-sidebar-foreground/55 mt-1 text-[8px]">
                                                                {formatChatTime(item.updatedAt)}
                                                            </p>
                                                        </div>
                                                    </SidebarMenuButton>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <SidebarMenuAction showOnHover>
                                                                <Ellipsis size={16} />
                                                                <span className="sr-only">Open chat actions</span>
                                                            </SidebarMenuAction>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent side="right" align="start">
                                                            <DropdownMenuItem onClick={() => {}}>
                                                                <Archive size={16} />
                                                                Archive
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {}}>
                                                                <Pin size={16} />
                                                                Pin
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(item)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 size={16} />
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
                            This action cannot be undone. This will permanently delete the chat.
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
