"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toggleLike } from "@/app/actions";
import { cn } from "@/lib/utils";

import Link from "next/link";

interface PostProps {
    id: string;
    content: string;
    image_url?: string | null;
    created_at: string;
    likes_count: number;
    comments_count: number;
    has_liked?: boolean;
    author_id: string;
    profiles: {
        full_name: string | null;
        headline: string | null;
        avatar_url: string | null;
    } | null;
}

export default function PostCard({ id, content, image_url, created_at, likes_count, comments_count, has_liked, author_id, profiles }: PostProps) {
    const [isLiked, setIsLiked] = useState(has_liked);
    const [likes, setLikes] = useState(likes_count);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async () => {
        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));
        setIsAnimating(true);

        // Server action
        await toggleLike(id);

        setTimeout(() => setIsAnimating(false), 300);
    };

    const authorName = profiles?.full_name || "Người dùng ẩn danh";
    const authorRole = profiles?.headline || "Thành viên";
    const authorAvatar = profiles?.avatar_url || "";
    const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: vi });

    return (
        <Card className="mb-4 w-full">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Link href={`/profile/${author_id}`}>
                    <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={authorAvatar} alt={authorName} />
                        <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-col">
                    <Link href={`/profile/${author_id}`} className="hover:underline">
                        <p className="text-sm font-semibold">{authorName}</p>
                    </Link>
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
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "flex-1 gap-2 hover:text-red-500 transition-colors",
                        isLiked ? "text-red-500" : "text-muted-foreground"
                    )}
                    onClick={handleLike}
                >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current", isAnimating && "animate-bounce")} />
                    <span className="text-xs">{likes}</span>
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
