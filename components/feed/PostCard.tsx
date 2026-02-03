"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface PostProps {
    author: {
        name: string;
        role: string;
        avatarUrl?: string;
    };
    content: string;
    imageUrl?: string;
    timestamp: string;
    likes: number;
    comments: number;
}

export default function PostCard({ author, content, imageUrl, timestamp, likes, comments }: PostProps) {
    return (
        <Card className="mb-4 w-full">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                    <AvatarImage src={author.avatarUrl} alt={author.name} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold">{author.name}</p>
                    <p className="text-xs text-muted-foreground">{author.role} • {timestamp}</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="whitespace-pre-wrap text-sm mb-3">{content}</p>
                {imageUrl && (
                    <div className="relative w-full h-[300px] rounded-md overflow-hidden bg-muted">
                        <Image
                            src={imageUrl}
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
                    <span className="text-xs">{likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                </Button>
            </CardFooter>
        </Card>
    );
}
