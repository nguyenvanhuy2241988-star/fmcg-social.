'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function createPost(formData: FormData) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Bạn cần đăng nhập để đăng bài.' }
    }

    const content = formData.get('content') as string
    const imageFile = formData.get('image') as File

    let imageUrl = null

    // 2. Upload Image if exists
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(filePath, imageFile)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { error: 'Lỗi khi tải ảnh lên.' }
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath)

        imageUrl = publicUrl
    }

    // 3. Insert Post into Database
    const { error: insertError } = await supabase
        .from('posts')
        .insert({
            content,
            image_url: imageUrl,
            author_id: user.id
        })

    if (insertError) {
        console.error('Insert error:', insertError)
        return { error: 'Lỗi khi đăng bài viết.' }
    }

    revalidatePath('/')
    return { success: true }
}

export async function toggleLike(postId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if like exists
    const { data: existingLike } = await supabase
        .from('likes')
        .select()
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single()

    if (existingLike) {
        // Unlike
        await supabase.from('likes').delete().eq('id', existingLike.id)
    } else {
        // Like
        await supabase.from('likes').insert({
            user_id: user.id,
            post_id: postId
        })
    }

    revalidatePath('/')
    return { success: true }
}
