'use client'

import { type LucideIcon } from 'lucide-react'

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}) {
    const router = useRouter()
    const pathname = usePathname()
    const { state } = useSidebar()
    const [search, setSearch] = useState<string>("")
    const [filteredItems, setFilteredItems] = useState(items)

    useEffect(() => {
        const filteredItems = items.filter((item) =>
            item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
            search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            )
        )
        setFilteredItems(filteredItems)
    }, [search, items])
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <div className={`items-center pb-3 border-b border-foreground/10 ${state === "collapsed" ? 'hidden' : 'flex'}`}>
                        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    {state === 'expanded' &&
                        filteredItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={pathname === item.url}
                                    title={item.title}
                                    className="cursor-pointer"
                                    onClick={() => router.push(item.url)}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
