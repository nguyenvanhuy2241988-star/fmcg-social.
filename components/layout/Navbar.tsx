```
import Link from "next/link"
import { Search, Bell, MessageSquare, Home, Users, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/UserNav"
import { createClient } from "@/utils/supabase/server"

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
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm nhân tài, cơ hội..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm placeholder:text-gray-400"
            />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary hover:bg-primary/5 hidden sm:flex">
                <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary hover:bg-primary/5 hidden sm:flex">
                <Users className="h-5 w-5" />
            </Button>
            
            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            {user ? (
                <>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary hover:bg-primary/5 relative">
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary hover:bg-primary/5">
                        <Bell className="h-5 w-5" />
                    </Button>
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
```
