'use client'

import * as React from 'react'
import { HelpCircleIcon, PenLine, Sparkles } from 'lucide-react'

import { NavMain } from '@/components/chat/nav-main'
import { NavSecondary } from '@/components/chat/nav-secondary'
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
import { Chat } from '@niato-ai/prisma-client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'

interface AppSidebarProps {
    props?: React.ComponentProps<typeof Sidebar>
    chatList?: Chat[]
}

export function AppSidebar({ chatList, ...props }: AppSidebarProps) {
    const { state } = useSidebar()
    const data = {
        navMain:
            chatList?.map((chat) => ({
                title: chat.title,
                url: `/chat/${chat.id}`,
            })) ?? [],
        navSecondary: [
            {
                title: 'Get Help',
                url: '/help',
                icon: HelpCircleIcon,
            },
        ],
    }
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2 justify-between">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5 w-fit h-fit"
                        >
                            <Link href="/chat">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-base font-semibold">niato ai.</span>
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
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
