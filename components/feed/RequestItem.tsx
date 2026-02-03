"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X } from "lucide-react"
import { acceptConnectionRequest } from "@/app/actions_connections"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface RequestItemProps {
    request: {
        requester: {
            id: string,
            full_name: string | null,
            avatar_url: string | null,
            headline: string | null
        }
    }
}

export function RequestItem({ request }: RequestItemProps) {
    const [isAccepted, setIsAccepted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleAccept = async () => {
        setIsLoading(true)
        const res = await acceptConnectionRequest(request.requester.id)
        setIsLoading(false)

        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: res.error
            })
        } else {
            setIsAccepted(true)
            toast({
                title: "Đã kết nối",
                description: `Bạn và ${request.requester.full_name} đã trở thành bạn bè.`
            })
        }
    }

    if (isAccepted) return null // Hide after accepting

    return (
        <div className="flex items-center gap-3 p-2 bg-white rounded border mb-2">
            <Link href={`/profile/${request.requester.id}`}>
                <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={request.requester.avatar_url || ""} />
                    <AvatarFallback>{request.requester.full_name?.[0]}</AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
                <Link href={`/profile/${request.requester.id}`}>
                    <p className="text-sm font-medium truncate hover:underline cursor-pointer">
                        {request.requester.full_name}
                    </p>
                </Link>
                <p className="text-xs text-muted-foreground truncate">
                    {request.requester.headline || "Thành viên mới"}
                </p>
            </div>
            <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 text-teal-600 hover:bg-teal-50 border-teal-200"
                onClick={handleAccept}
                disabled={isLoading}
            >
                <Check className="h-4 w-4" />
            </Button>
        </div>
    )
}
