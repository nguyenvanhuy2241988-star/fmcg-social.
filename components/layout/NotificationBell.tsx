"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions_notifications";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function NotificationBell({ currentUser }: { currentUser: any }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadNotifications();

        // Realtime Subscription
        const supabase = createClient();
        const channel = supabase
            .channel(`notifications-${currentUser.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `receiver_id=eq.${currentUser.id}`
                },
                (payload) => {
                    console.log("New Notification", payload);
                    loadNotifications();
                    // Play sound or show toast?
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [currentUser.id]);

    const loadNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && unreadCount > 0) {
            // Mark all as read after a short delay or immediately?
            // Let's mark specific clicked notifications typically, but for simplicity mark all read when opening?
            // Or just reset the badge locally
            // await markAllAsRead(); 
            // setUnreadCount(0); 
        }
    };

    const handleNotificationClick = async (notification: any) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
        }
    };

    const getNotificationContent = (n: any) => {
        const actorName = n.actor?.full_name || "Ai đó";
        switch (n.type) {
            case 'like':
                return <span><strong>{actorName}</strong> đã thích bài viết của bạn.</span>;
            case 'comment':
                return <span><strong>{actorName}</strong> đã bình luận về bài viết của bạn.</span>;
            case 'connection_request':
                return <span><strong>{actorName}</strong> muốn kết nối với bạn.</span>;
            case 'connection_accepted':
                return <span><strong>{actorName}</strong> đã đồng ý kết nối.</span>;
            default:
                return <span>Thông báo mới từ <strong>{actorName}</strong>.</span>;
        }
    };

    const getLink = (n: any) => {
        if (n.type === 'connection_request' || n.type === 'connection_accepted') return `/profile/${n.actor_id}`;
        // If posts page exists or profile link
        // For now link to home or profile? Ideally link to post anchor.
        // Let's assume user posts are on their profile or global feed.
        return `/`; // Simplified for now
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-teal-600 hover:bg-teal-50">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                    <h4 className="font-bold text-sm">Thông báo</h4>
                    <button
                        onClick={async () => {
                            await markAllAsRead();
                            setUnreadCount(0);
                            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                        }}
                        className="text-xs text-teal-600 hover:underline"
                    >
                        Đánh dấu đã đọc
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <Link
                                key={n.id}
                                href={getLink(n)}
                                onClick={() => handleNotificationClick(n)}
                            >
                                <div className={`flex gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-0 ${!n.is_read ? 'bg-teal-50/30' : ''}`}>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={n.actor?.avatar_url} />
                                        <AvatarFallback>{n.actor?.full_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm text-gray-800 leading-snug">
                                            {getNotificationContent(n)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: vi })}
                                        </p>
                                    </div>
                                    {!n.is_read && (
                                        <div className="h-2 w-2 bg-teal-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Chưa có thông báo mới</p>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
