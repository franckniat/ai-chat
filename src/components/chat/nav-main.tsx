"use client";

import { Archive, Ellipsis, Pin, Trash2, type LucideIcon } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
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

export function NavMain({
    items,
}: {
    items: {
        id: string;
        title: string;
        url: string;
        icon?: LucideIcon;
    }[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { state } = useSidebar();
    const [search, setSearch] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; url: string } | null>(null);

    useEffect(() => {
        const filteredItems = items.filter((item) =>
            item.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(
                    search
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                )
        );
        setFilteredItems(filteredItems);
    }, [search, items]);

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
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <div
                        className={`items-center pb-3 border-b border-foreground/10 ${state === "collapsed" ? "hidden" : "flex"}`}
                    >
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {state === "expanded" &&
                        filteredItems.map((item) => (
                            <SidebarMenuItem key={item.title} className="flex items-center justify-between gap-1">
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={pathname === item.url}
                                    title={item.title}
                                    className="cursor-pointer flex justify-between gap-1 items-center group"
                                    onClick={() => router.push(item.url)}
                                >
                                    <span className="line-clamp-1">{item.title}</span>
                                </SidebarMenuButton>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={"ghost"} size={"icon-sm"} className="z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Ellipsis size={16} />
                                        </Button>
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
