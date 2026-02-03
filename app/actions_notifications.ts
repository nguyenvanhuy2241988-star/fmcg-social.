'use server'

import { createClient } from "@/utils/supabase/server";

export async function createNotification(
    receiver_id: string,
    type: 'like' | 'comment' | 'connection_request' | 'connection_accepted',
    entity_id: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;
    if (user.id === receiver_id) return; // Don't notify self

    // Check for existing notification to avoid duplicates (especially for likes)
    if (type === 'like' || type === 'connection_request') {
        const { data: existing } = await supabase
            .from('notifications')
            .select('id')
            .eq('actor_id', user.id)
            .eq('receiver_id', receiver_id)
            .eq('type', type)
            .eq('entity_id', entity_id)
            .single();

        if (existing) return;
    }

    await supabase.from('notifications').insert({
        receiver_id,
        actor_id: user.id,
        type,
        entity_id
    });
}

export async function getNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from('notifications')
        .select(`
            *,
            actor:actor_id (
                full_name,
                avatar_url
            )
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    return data || [];
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
}

export async function markAllAsRead() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.from('notifications').update({ is_read: true }).eq('receiver_id', user.id);
    }
}
