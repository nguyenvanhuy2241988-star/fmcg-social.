import Link from "next/link";
import { Bell, Briefcase, Home, MessageSquare, Search, Users } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-primary text-xl">
                            FMCG<span className="text-foreground">Social</span>
                        </span>
                    </Link>
                    <div className="relative hidden w-full max-w-sm sm:flex items-center">
                        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <NavItem href="/" icon={Home} label="Trang chủ" active />
                    <NavItem href="/network" icon={Users} label="Mạng lưới" />
                    <NavItem href="/jobs" icon={Briefcase} label="Việc làm" />
                    <NavItem href="/messages" icon={MessageSquare} label="Tin nhắn" />
                    <NavItem href="/notifications" icon={Bell} label="Thông báo" />

                    <div className="ml-4 h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
                        {/* Avatar Placeholder */}
                        <span className="text-xs font-bold">ME</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors hover:text-primary ${active ? "text-primary" : "text-muted-foreground"
                }`}
        >
            <Icon className="h-5 w-5" />
            <span className="hidden md:inline">{label}</span>
            {active && <span className="absolute bottom-0 h-[2px] w-full bg-primary" />}
        </Link>
    );
}
