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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetTrigger,
} from '@/components/ui/sheet'
import { signOut } from '@/lib/auth-client';
import { useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { Menu, Moon, Sparkles, SquareArrowOutUpRight, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'

/**
 * Position de defilement lue via `useSyncExternalStore` : c'est le primitif
 * prevu pour s'abonner a une source exterieure a React. Un `useEffect` qui
 * appelle `setState` des le montage declenche un rendu en cascade — ce que
 * `react-hooks/set-state-in-effect` signale.
 */
function subscribeToScroll(onChange: () => void) {
    window.addEventListener('scroll', onChange, { passive: true })
    return () => window.removeEventListener('scroll', onChange)
}

const getIsScrolled = () => window.scrollY > 30
// Le serveur ne defile pas : l'etat initial est toujours « en haut ».
const getServerIsScrolled = () => false

export default function Navbar() {
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const scrolled = useSyncExternalStore(
        subscribeToScroll,
        getIsScrolled,
        getServerIsScrolled,
    )
    const [mobileOpen, setMobileOpen] = useState(false)
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
            href: '/support',
            label: 'Contact',
            active: pathname === '/support',
        },
    ]

    const { data: session } = useSession()

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }
    return (
        <nav
            className={cn(
                'navbar fixed top-3 z-50 left-1/2 w-[calc(100%-1.5rem)] max-w-[1000px] -translate-x-1/2 rounded-xl transition-all md:min-w-[600px] lg:min-w-[900px]',
                scrolled &&
                    'border border-foreground/20 bg-background/60 shadow-lg backdrop-blur-lg',
            )}
        >
            <div className="max-w-[1280px] mx-auto px-3">
                <div className="flex items-center justify-between h-[65px]">
                    <Link href="/" className="flex items-center gap-2 lg:gap-3">
                        <Sparkles className="size-4" />
                        <span className=" text-base lg:text-lg font-bold font-display">niato ai .</span>
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
                            <span className="sr-only">Toggle theme</span>
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
                            <Link href={'/login'} className="hidden md:block">
                                <Button size={'sm'} className="text-sm">
                                    Get Started
                                </Button>
                            </Link>
                        )}

                        {/* Navigation mobile : sans elle, un visiteur non connecte
                            n'a ni liens ni moyen de s'inscrire sous 768px. */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="size-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[min(20rem,85vw)]">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2 font-display">
                                        <Sparkles className="size-4" />
                                        niato ai .
                                    </SheetTitle>
                                </SheetHeader>
                                {/* `SheetClose asChild` ferme le panneau au clic :
                                    Radix ne le fait pas pour un lien, et un
                                    useEffect sur `pathname` declencherait un
                                    setState en cascade a chaque navigation. */}
                                <div className="flex flex-col gap-1 px-4">
                                    {navLinks.map((link) => (
                                        <SheetClose asChild key={link.href}>
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                                                    link.active &&
                                                        'bg-accent text-accent-foreground',
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </div>
                                <div className="mt-auto flex flex-col gap-2 border-t p-4">
                                    {session ? (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/chat">
                                                    <Button className="w-full">Go to chat</Button>
                                                </Link>
                                            </SheetClose>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/login">
                                                    <Button className="w-full">Get Started</Button>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/register">
                                                    <Button variant="outline" className="w-full">
                                                        Create an account
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
