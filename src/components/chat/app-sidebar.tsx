'use client'

import * as React from 'react'
import { Github, PenLine, Sparkles } from 'lucide-react'

import { NavMain } from '@/components/chat/nav-main'
import { NavUser } from '@/components/chat/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { Chat } from '@/generated/prisma/client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'

interface AppSidebarProps {
    props?: React.ComponentProps<typeof Sidebar>
    chatList?: Chat[]
}

export function AppSidebar({ chatList, ...props }: AppSidebarProps) {
    const { state } = useSidebar()
    // `navSecondary` construisait un lien « Get Help » vers /help — une route
    // inexistante — et n'etait de toute facon jamais rendu.
    const data = {
        navMain:
            chatList?.map((chat) => ({
                id: chat.id,
                title: chat.title,
                url: `/chat/${chat.id}`,
                updatedAt: chat.updatedAt,
            })) ?? [],
    }
    return (
        <Sidebar collapsible="offcanvas" {...props} variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2 justify-between">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5 w-fit h-fit"
                        >
                            <Link href="/">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-base font-semibold font-display">niato ai.</span>
                            </Link>
                        </SidebarMenuButton>
                        {state === 'expanded' && (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={'/chat'}
                                            className={cn(
                                                buttonVariants({ variant: 'ghost', size: 'icon' }),
                                            )}
                                        >
                                            <PenLine size={18} />
                                            <span className="sr-only">Open chat</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>New chat</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                {state === 'expanded' && (
                    <a
                        href={siteConfig.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors"
                    >
                        <Github className="size-3.5" aria-hidden="true" />
                        Source on GitHub
                    </a>
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
