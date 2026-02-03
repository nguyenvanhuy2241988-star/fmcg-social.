'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Submit Verification Request (User)
export async function submitVerificationRequest(imageUrl: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Vui lòng đăng nhập" };

    // Check existing request
    const { data: existing } = await supabase
        .from('verification_requests')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

    if (existing) {
        return { error: "Bạn đang có yêu cầu chờ duyệt rồi." };
    }

    const { error } = await supabase
        .from('verification_requests')
        .insert({
            user_id: user.id,
            image_url: imageUrl,
            status: 'pending'
        });

    if (error) {
        console.error(error);
        return { error: "Lỗi gửi yêu cầu." };
    }

    revalidatePath('/verify');
    return { success: true };
}

// 2. Get All Pending Requests (Admin)
export async function getVerificationRequests() {
    const supabase = await createClient();

    // Auth Check: Is Admin?
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return [];

    const { data: requests } = await supabase
        .from('verification_requests')
        .select(`
            *,
            profile:user_id ( full_name, email, avatar_url )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    return requests || [];
}

// 3. Approve Request (Admin)
export async function approveVerification(requestId: string, userId: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (admin?.role !== 'admin') return { error: "Unauthorized" };

    // Transaction: Update Request Status AND Profile Verified Status
    const { error: reqError } = await supabase
        .from('verification_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

    if (reqError) return { error: "Error updating request" };

    const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId);

    if (profileError) return { error: "Error updating profile" };

    revalidatePath('/admin');
    return { success: true };
}

// 4. Reject Request (Admin)
export async function rejectVerification(requestId: string) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: admin } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (admin?.role !== 'admin') return { error: "Unauthorized" };

    const { error } = await supabase
        .from('verification_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

    if (error) return { error: "Error rejecting" };

    revalidatePath('/admin');
    return { success: true };
}
