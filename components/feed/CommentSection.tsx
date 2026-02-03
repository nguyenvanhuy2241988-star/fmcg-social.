"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { addComment, getComments } from "@/app/actions_comments";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
        headline: string | null;
    } | null;
}

interface CommentSectionProps {
    postId: string;
    currentUser: any; // User object from Supabase Auth
}

export default function CommentSection({ postId, currentUser }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const data = await getComments(postId);
            setComments(data as any);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        setIsSending(true);
        try {
            await addComment(postId, newComment);
            setNewComment("");
            // Optimistic update or reload
            loadComments();
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="border-t pt-4 mt-2">
            {/* List Comments */}
            <div className="space-y-4 mb-4">
                {isLoading ? (
                    <p className="text-center text-xs text-muted-foreground">Đang tải bình luận...</p>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <Link href={`/profile/${comment.user_id}`}>
                                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
                                    <AvatarImage src={comment.profiles?.avatar_url || ""} />
                                    <AvatarFallback>{comment.profiles?.full_name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="bg-gray-100 rounded-lg px-3 py-2 flex-1 relative group">
                                <Link href={`/profile/${comment.user_id}`} className="hover:underline">
                                    <span className="font-bold text-sm text-gray-900 block">
                                        {comment.profiles?.full_name || "Người dùng"}
                                    </span>
                                </Link>
                                <p className="text-sm text-gray-700 break-words">{comment.content}</p>
                                <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">
                                    {formatDistanceToNow(new Date(comment.created_at), { locale: vi })}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xs text-muted-foreground py-2">Chưa có bình luận nào.</p>
                )}
            </div>

            {/* Input Form */}
            {currentUser && (
                <div className="flex gap-2 items-start">
                    <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                        <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                    <form onSubmit={handleSubmit} className="flex-1 relative">
                        <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận..."
                            className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            disabled={isSending}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1 h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            disabled={!newComment.trim() || isSending}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
