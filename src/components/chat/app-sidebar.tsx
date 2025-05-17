"use client"

import * as React from "react"
import {
    HelpCircleIcon,
    Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/chat/nav-main"
import { NavSecondary } from "@/components/chat/nav-secondary"
import { NavUser } from "@/components/chat/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
    navMain: [],
    navSecondary: [
        {
            title: "Get Help",
            url: "#",
            icon: HelpCircleIcon,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/chat">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-base font-semibold">niato ai.</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
