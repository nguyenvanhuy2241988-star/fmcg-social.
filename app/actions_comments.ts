'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(postId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            user_id: user.id,
            content: content
        });

    if (error) {
        console.error("Error adding comment:", error);
        throw new Error("Failed to add comment");
    }

    // Update comments count in posts table (optional but good for performance)
    // We can use a database trigger for this, or just increment it here manually if we want to be simple
    // RPC call would be better for atomicity, but for now let's just insert.
    // Ideally, we should fetch the count dynamically or use a trigger. 
    // Let's implement a simple direct increment if possible, or just revalidate.

    // Increment comment_count
    await supabase.rpc('increment_comments_count', { post_id: postId });

    // Notify Post Author
    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single();
    if (post) {
        const { createNotification } = await import('./actions_notifications');
        await createNotification(post.author_id, 'comment', postId);
    }

    revalidatePath('/');
    revalidatePath(`/profile/${user.id}`); // In case it's on profile
}

export async function getComments(postId: string) {
    const supabase = await createClient();

    const { data: comments } = await supabase
        .from('comments')
        .select(`
            *,
            profiles (
                full_name,
                avatar_url,
                headline
            )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    return comments || [];
}
