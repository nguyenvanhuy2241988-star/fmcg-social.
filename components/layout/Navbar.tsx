import Link from "next/link"
import { Search, Bell, MessageSquare, Home, Users, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/UserNav"
import { createClient } from "@/utils/supabase/server"
import SearchInput from "@/components/layout/SearchInput"
import NotificationBell from "./NotificationBell"

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                        <span className="text-white font-bold text-xl">F</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent hidden sm:block">
                        FMCGSocial
                    </span>
                </Link>

                {/* Search Bar - Minimalist */}
                <div className="hidden md:flex relative w-1/3 max-w-sm items-center">
                    <SearchInput />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary hover:bg-primary/5 hidden sm:flex">
                        <Home className="h-5 w-5" />
                    </Button>
                    <Link href="/network">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-teal-600 hover:bg-teal-50 hidden sm:flex" title="Đội nhóm">
                            <Users className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/jobs">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-teal-600 hover:bg-teal-50 hidden sm:flex" title="Việc làm">
                            <Briefcase className="h-5 w-5" />
                        </Button>
                    </Link>

                    <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                    {user ? (
                        <>
                            <Link href="/messages">
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-teal-600">
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                            </Link>
                            <NotificationBell currentUser={user} />
                            <div className="ml-2">
                                <UserNav user={user} />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost">Đăng nhập</Button>
                            </Link>
                            <Link href="/login">
                                <Button>Đăng ký</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
