"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { EditProfileModal } from "@/components/profile/EditProfileModal"

export default function ProfileEditWrapper({ profile }: { profile: any }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button size="sm" onClick={() => setIsOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
                <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa thẻ
            </Button>

            <EditProfileModal
                profile={profile}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}
