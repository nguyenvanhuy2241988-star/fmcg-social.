'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"

export default function SuggestedConnections() {
    // Mock Data for now (In real app, fetch from API excluding friends)
    const suggestions = [
        { id: '1', name: 'Nguyễn Văn A', headline: 'Sales Manager @ Vinamilk', avatar: '' },
        { id: '2', name: 'Trần Thị B', headline: 'HR Director @ Masan', avatar: '' },
        { id: '3', name: 'Lê Văn C', headline: 'Distributor @ Unilever', avatar: '' },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">Có thể bạn quen</h3>
            <div className="space-y-3">
                {suggestions.map((user) => (
                    <div key={user.id} className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <Link href="#" className="font-medium text-sm text-gray-900 hover:text-teal-600 truncate block">
                                {user.name}
                            </Link>
                            <p className="text-xs text-muted-foreground truncate mb-1">{user.headline}</p>
                            <Button variant="outline" size="sm" className="h-7 text-xs w-full flex items-center justify-center gap-1">
                                <UserPlus className="h-3 w-3" /> Kết nối
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-3 pt-2 border-t text-center">
                <Link href="#" className="text-xs text-teal-600 hover:underline">Xem tất cả</Link>
            </div>
        </div>
    )
}
