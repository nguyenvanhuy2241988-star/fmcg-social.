'use server'

import { createClient } from "@/utils/supabase/server";

export async function searchGlobal(query: string) {
    if (!query || query.trim().length === 0) return { users: [], posts: [] };

    const supabase = await createClient();
    const searchTerm = `%${query}%`;

    // 1. Search Users
    const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, headline, avatar_url, zone')
        .ilike('full_name', searchTerm)
        .limit(5);

    // 2. Search Posts
    const { data: posts } = await supabase
        .from('posts')
        .select(`
            *,
            profiles (
                full_name,
                avatar_url,
                headline
            ),
            likes (user_id)
        `)
        .ilike('content', searchTerm)
        .order('created_at', { ascending: false })
        .limit(10);

    // Add has_liked to posts
    const { data: { user } } = await supabase.auth.getUser();
    const formattedPosts = posts?.map((post) => ({
        ...post,
        has_liked: post.likes.some((like: any) => like.user_id === user?.id),
        author_id: post.author_id
    })) || [];

    return {
        users: users || [],
        posts: formattedPosts
    };
}
