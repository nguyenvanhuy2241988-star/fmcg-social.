'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted'

export async function getConnectionStatus(targetUserId: string): Promise<ConnectionStatus> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 'none'
    if (user.id === targetUserId) return 'none'

    const { data } = await supabase
        .from('connections')
        .select('*')
        .or(`and(requester_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .single()

    if (!data) return 'none'

    if (data.status === 'accepted') return 'accepted'

    if (data.requester_id === user.id) return 'pending_sent'

    return 'pending_received'
}

export async function sendConnectionRequest(targetUserId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('connections')
        .insert({
            requester_id: user.id,
            receiver_id: targetUserId,
            status: 'pending'
        })

    if (error) {
        console.error('Connection request error:', error)
        return { error: 'Failed to send request' }
    }

    revalidatePath(`/profile/${targetUserId}`)
    return { success: true }
}

export async function acceptConnectionRequest(requesterId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('requester_id', requesterId)
        .eq('receiver_id', user.id)

    if (error) {
        console.error('Accept connection error:', error)
        return { error: 'Failed to accept request' }
    }

    revalidatePath(`/profile/${requesterId}`)
    return { success: true }
}

export async function getConnections(userId: string) {
    const supabase = await createClient()

    // Get all 'accepted' connections where user is either requester or receiver
    const { data } = await supabase
        .from('connections')
        .select(`
            requester:requester_id(id, full_name, avatar_url, headline),
            receiver:receiver_id(id, full_name, avatar_url, headline)
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)

    if (!data) return []

    // Map to a clean list of "friends"
    return data.map((conn: any) => {
        // If I am requester, friend is receiver. If I am receiver, friend is requester
        if (conn.requester.id === userId) return conn.receiver
        return conn.requester
    })
}
