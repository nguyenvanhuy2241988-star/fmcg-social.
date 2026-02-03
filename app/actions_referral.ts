'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Get or Create Referral Code for Current User
export async function getReferralCode() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch existing code
    const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

    if (profile?.referral_code) {
        return profile.referral_code;
    }

    // Generate new code if missing (using the database function or manual logic)
    // Let's use a simple manual update to be safe if trigger isn't set
    const newCode = Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();

    const { error } = await supabase
        .from('profiles')
        .update({ referral_code: newCode })
        .eq('id', user.id);

    if (error) {
        console.error("Error generating referral code:", error);
        return null;
    }

    return newCode;
}

// 2. Statistics: Count how many people I invited (F1)
export async function getReferralStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { count: 0, list: [] };

    // Count
    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id);

    // Get List (Limit 20)
    const { data: list } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, headline, created_at')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    return {
        count: count || 0,
        list: list || []
    };
}

// 3. Apply Referral Code (When a user enters a code)
// Typically used during Onboarding or Profile Edit
export async function applyReferralCode(code: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Vui lòng đăng nhập" };

    // Check if user already has a referrer
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('referrer_id, referral_code')
        .eq('id', user.id)
        .single();

    if (currentProfile?.referrer_id) {
        return { error: "Bạn đã được giới thiệu bởi người khác rồi." };
    }

    if (currentProfile?.referral_code === code) {
        return { error: "Bạn không thể tự giới thiệu chính mình." };
    }

    // Find the owner of the code
    const { data: referrer } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', code)
        .single();

    if (!referrer) {
        return { error: "Mã giới thiệu không tồn tại." };
    }

    // Update current user's referrer_id
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ referrer_id: referrer.id })
        .eq('id', user.id);

    if (updateError) {
        return { error: "Có lỗi xảy ra. Thử lại sau." };
    }

    // 4. Get My Referrer (Who invited me?)
    export async function getMyReferrer() {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select(`
            referrer:referrer_id (
                full_name,
                avatar_url,
                headline,
                email
            )
        `)
            .eq('id', user.id)
            .single();

        return profile?.referrer; // Returns the referrer object or null
    }
