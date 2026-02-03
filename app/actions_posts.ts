'use server'

import { createClient } from "@/utils/supabase/server";

export async function getUserPosts(userId: string) {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from('posts')
        .select(`
            *,
            profiles (
                full_name,
                headline,
                avatar_url
            ),
            likes (
                user_id
            )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (!posts) return [];

    // Add has_liked field (checking if CURRENT user liked these posts)
    const { data: { user } } = await supabase.auth.getUser();

    return posts.map((post) => ({
        ...post,
        has_liked: post.likes.some((like: any) => like.user_id === user?.id),
        author_id: post.author_id
    }));
}
