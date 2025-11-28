'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client'
import { Moon, Sparkles, SquareArrowOutUpRight, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function Navbar() {
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const navLinks = [
        {
            href: '/',
            label: 'Home',
            active: pathname === '/',
        },
        {
            href: '/products',
            label: 'Products',
            active: pathname === '/products',
        },
        {
            href: '/pricing',
            label: 'Pricing',
            active: pathname === '/pricing',
        },
        {
            href: '/Contact',
            label: 'Contact',
            active: pathname === '/Contact',
        },
    ]

    useEffect(() => {
        const navbar = document.querySelector('.navbar')
        const handleScroll = () => {
            if (window.scrollY > 30) {
                navbar?.classList.add(
                    'border',
                    'border-foreground/20',
                    'shadow-lg',
                    'bg-background/60',
                    'backdrop-blur-lg',
                )
            } else {
                navbar?.classList.remove(
                    'border',
                    'border-foreground/20',
                    'shadow-lg',
                    'bg-background/60',
                    'backdrop-blur-lg',
                )
            }
        }
        if (navbar) {
            window.addEventListener('scroll', handleScroll)
            return () => {
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])
    const { data: session } = useSession()
    
    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }
    return (
        <nav className="navbar fixed top-3 z-50 lg:min-w-[900px] w-full max-w-[1000px] md:min-w-[600px] left-1/2 -translate-x-1/2 rounded-xl">
            <div className="max-w-[1280px] mx-auto px-3">
                <div className="flex items-center justify-between h-[65px]">
                    <Link href="/" className="flex items-center gap-2 lg:gap-3">
                        <Sparkles className="size-4" />
                        <span className=" text-base lg:text-lg font-bold">niato ai .</span>
                    </Link>
                    <div className="hidden items-center gap-2 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm hover:text-primary/80 px-3 py-2 transition-colors font-medium ${link.active ? 'text-primary font-bold underline underline-offset-4' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            className="relative"
                            variant={'ghost'}
                            onClick={() => {
                                setTheme(theme === 'dark' ? 'light' : 'dark')
                            }}
                        >
                            <Sun className="size-4 dark:scale-0 scale-100 rotate-0 dark:rotate-12 transition-all absolute" />
                            <Moon className="size-4 dark:scale-100 scale-0 dark:rotate-0 rotate-12 transition-all" />
                        </Button>
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="cursor-pointer rounded-full">
                                    <Avatar>
                                        <AvatarImage
                                            src={session.user?.image || undefined}
                                            alt="User Avatar"
                                            className="object-cover"
                                        />
                                        <AvatarFallback>
                                            {session.user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href="/chat" className="flex items-center gap-3 cursor-pointer">Go to chat <SquareArrowOutUpRight size={15}/></Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-xs text-muted-foreground">Account</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center gap-3 cursor-pointer">Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="flex items-center gap-3 cursor-pointer">Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild variant="destructive">
                                            <button onClick={handleLogout} className="flex items-center gap-3 cursor-pointer w-full">Logout</button>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href={'/login'}>
                                <Button size={'sm'} className="hidden md:block text-sm">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
