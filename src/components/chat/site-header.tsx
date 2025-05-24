"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function SiteHeader() {
    const { state, isMobile } = useSidebar();
    const { theme, setTheme } = useTheme();
    return (
        <header
            className={`group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] bg-background/90 backdrop-blur ease-linear fixed top-0 z-50 ${isMobile ? "w-full" : ""} ${state === "expanded" && `w-[calc(100%-16rem)]`} ${state === "collapsed" && `w-[calc(100%-3rem)]`}`}
        >
            <div className="flex w-full justify-between items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className="relative"
                        variant={"ghost"}
                        onClick={() => {
                            setTheme(theme === "dark" ? "light" : "dark");
                        }}
                    >
                        <Sun className="size-4 dark:scale-0 scale-100 rotate-0 dark:rotate-12 transition-all absolute" />
                        <Moon className="size-4 dark:scale-100 scale-0 dark:rotate-0 rotate-12 transition-all" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
