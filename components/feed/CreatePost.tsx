"use client"

import { useState, useRef } from "react"
import { createPost } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Loader2, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { User } from "@supabase/supabase-js"

export default function CreatePost({ user }: { user: User | null }) {
    const [content, setContent] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    if (!user) return null // Hide if not logged in

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const removeImage = () => {
        setImage(null)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSubmit = async () => {
        if (!content.trim() && !image) return

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("content", content)
        if (image) {
            formData.append("image", image)
        }

        const res = await createPost(formData)
        setIsSubmitting(false)

        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: res.error,
            })
        } else {
            setContent("")
            removeImage()
            toast({
                title: "Thành công!",
                description: "Bài viết của bạn đã được đăng.",
            })
        }
    }

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={user.user_metadata.avatar_url} />
                        <AvatarFallback>{user.user_metadata.full_name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        <Textarea
                            placeholder="Bạn đang nghĩ gì? (Tuyển dụng / Tìm việc...)"
                            className="min-h-[100px] border-none focus-visible:ring-0 resize-none p-0 text-base"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {previewUrl && (
                            <div className="relative rounded-md overflow-hidden border">
                                <img src={previewUrl} alt="Preview" className="max-h-[300px] w-full object-cover" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center border-t pt-4">
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-teal-600"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Ảnh/GIF
                                </Button>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || (!content.trim() && !image)}
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Đăng bài
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
