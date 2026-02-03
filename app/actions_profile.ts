'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const fullName = formData.get('fullName') as string
    const headline = formData.get('headline') as string
    const zone = formData.get('zone') as string
    const phone = formData.get('phone') as string
    const availabilityStatus = formData.get('availabilityStatus') as string

    // Handle categories (expecting comma separated string or multiple entries, 
    // for simplicity here treating as comma separated string from input)
    const categoriesRaw = formData.get('categories') as string
    const categories = categoriesRaw ? categoriesRaw.split(',').map(c => c.trim()).filter(c => c) : []

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            headline,
            zone,
            phone,
            categories,
            availability_status: availabilityStatus,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        console.error('Profile update error:', error)
        return { error: 'Lỗi khi cập nhật hồ sơ.' }
    }

    revalidatePath('/profile')
    revalidatePath('/')
    return { success: true }
}
