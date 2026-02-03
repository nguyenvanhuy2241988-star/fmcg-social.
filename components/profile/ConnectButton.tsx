"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, Check, Clock, UserCheck } from "lucide-react"
import { sendConnectionRequest, ConnectionStatus } from "@/app/actions_connections"
import { useToast } from "@/components/ui/use-toast"

interface ConnectButtonProps {
    targetUserId: string
    initialStatus: ConnectionStatus
}

export function ConnectButton({ targetUserId, initialStatus }: ConnectButtonProps) {
    const [status, setStatus] = useState<ConnectionStatus>(initialStatus)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleConnect = async () => {
        setIsLoading(true)
        const res = await sendConnectionRequest(targetUserId)
        setIsLoading(false)

        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: res.error
            })
        } else {
            setStatus("pending_sent")
            toast({
                title: "Thành công",
                description: "Đã gửi lời mời kết nối!"
            })
        }
    }

    if (status === "none") {
        return (
            <Button
                onClick={handleConnect}
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700 text-white"
            >
                <UserPlus className="mr-2 h-4 w-4" />
                Kết nối
            </Button>
        )
    }

    if (status === "pending_sent") {
        return (
            <Button variant="outline" disabled className="text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Đã gửi lời mời
            </Button>
        )
    }

    if (status === "pending_received") {
        return (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Check className="mr-2 h-4 w-4" />
                Chấp nhận kết nối
            </Button>
        )
    }

    if (status === "accepted") {
        return (
            <Button variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">
                <UserCheck className="mr-2 h-4 w-4" />
                Bạn bè
            </Button>
        )
    }

    return null
}
