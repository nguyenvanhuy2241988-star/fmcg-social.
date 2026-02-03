"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions_profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/custom-modal"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Profile {
    full_name: string | null
    headline: string | null
    zone: string | null
    phone: string | null
    categories: string[] | null
    availability_status: string | null
}

export function EditProfileModal({
    profile,
    isOpen,
    onClose
}: {
    profile: Profile,
    isOpen: boolean,
    onClose: () => void
}) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const res = await updateProfile(formData)
        setIsLoading(false)

        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: res.error,
            })
        } else {
            toast({
                title: "Thành công",
                description: "Hồ sơ đã được cập nhật.",
            })
            onClose()
        }
    }

    // Helper to format categories array to string
    const defaultCategories = profile.categories?.join(", ") || ""

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chỉnh sửa Hồ sơ Talent Card">
            <form action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" name="fullName" defaultValue={profile.full_name || ""} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="headline">Chức danh / Headline</Label>
                    <Input id="headline" name="headline" defaultValue={profile.headline || ""} placeholder="Ví dụ: Sales Supervisor @ Unilever" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="zone">Khu vực (Zone)</Label>
                        <Input id="zone" name="zone" defaultValue={profile.zone || ""} placeholder="Ví dụ: Hà Nội" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" name="phone" defaultValue={profile.phone || ""} placeholder="098..." required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="categories">Ngành hàng (cách nhau bởi dấu phẩy)</Label>
                    <Input id="categories" name="categories" defaultValue={defaultCategories} placeholder="Bia, Sữa, Hóa phẩm..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="availabilityStatus">Trạng thái tìm việc</Label>
                    <select
                        id="availabilityStatus"
                        name="availabilityStatus"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={profile.availability_status || "open_to_work"}
                    >
                        <option value="open_to_work">🔵 Đang tìm việc (Open to Work)</option>
                        <option value="hiring">🔴 Đang tuyển nhân viên (Hiring)</option>
                        <option value="busy">⚪ Đã ổn định (Busy)</option>
                    </select>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                    <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
