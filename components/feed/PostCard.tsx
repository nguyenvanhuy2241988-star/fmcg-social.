"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface PostProps {
    id: string;
    content: string;
    image_url?: string | null;
    created_at: string;
    likes_count: number;
    comments_count: number;
    profiles: {
        full_name: string | null;
        headline: string | null;
        avatar_url: string | null;
    } | null;
}

export default function PostCard({ content, image_url, created_at, likes_count, comments_count, profiles }: PostProps) {
    const authorName = profiles?.full_name || "Người dùng ẩn danh";
    const authorRole = profiles?.headline || "Thành viên";
    const authorAvatar = profiles?.avatar_url || "";
    const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: vi });

    return (
        <Card className="mb-4 w-full">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                    <AvatarImage src={authorAvatar} alt={authorName} />
                    <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold">{authorName}</p>
                    <p className="text-xs text-muted-foreground">{authorRole} • {timeAgo}</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="whitespace-pre-wrap text-sm mb-3">{content}</p>
                {image_url && (
                    <div className="relative w-full h-[300px] rounded-md overflow-hidden bg-muted">
                        <Image
                            src={image_url}
                            alt="Post content"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between p-2">
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-red-500">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{likes_count || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{comments_count || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                </Button>
            </CardFooter>
        </Card>
    );
}
