import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// Badge removed
import { MapPin, Phone, Briefcase, Calendar, Edit, Share2 } from "lucide-react";
import ProfileEditWrapper from "@/components/profile/ProfileEditWrapper"; // Wrapper to handle client-side modal state

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = params;

    // 1. Fetch Profile Data
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !profile) {
        return <div className="container py-10 text-center">Không tìm thấy hồ sơ người dùng.</div>;
    }

    // 2. Check if current user is owner
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const isOwner = currentUser?.id === profile.id;

    // 3. Status Color Logic
    const statusColors = {
        open_to_work: "bg-blue-100 text-blue-800 border-blue-200",
        hiring: "bg-red-100 text-red-800 border-red-200",
        busy: "bg-gray-100 text-gray-800 border-gray-200"
    };
    const statusLabels = {
        open_to_work: "Đang tìm việc",
        hiring: "Đang tuyển dụng",
        busy: "Đã ổn định"
    };
    const currentStatus = profile.availability_status as keyof typeof statusLabels || 'open_to_work';

    return (
        <div className="container max-w-2xl py-8">
            {/* TALENT CARD DESIGN */}
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden relative">
                {/* Cover Background (Teal Gradient) */}
                <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-600"></div>

                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end -mt-12 mb-4">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-2xl font-bold bg-teal-100 text-teal-800">
                                {profile.full_name?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex gap-2 mb-1">
                            {isOwner && (
                                <ProfileEditWrapper profile={profile} />
                            )}
                            <Button variant="outline" size="sm">
                                <Share2 className="h-4 w-4 mr-2" /> Share
                            </Button>
                        </div>
                    </div>

                    {/* Name & Headline */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColors[currentStatus]}`}>
                                {statusLabels[currentStatus]}
                            </span>
                        </div>
                        <p className="text-lg text-teal-700 font-medium">{profile.headline || "Chưa cập nhật chức danh"}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                            <span>{profile.zone || "Chưa cập nhật khu vực"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Phone className="h-5 w-5 mr-3 text-gray-400" />
                            <span>{profile.phone || "Chưa cập nhật SĐT"}</span>
                        </div>
                        <div className="flex items-center text-gray-600 col-span-2">
                            <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                                {profile.categories?.length > 0 ? (
                                    profile.categories.map((cat: string) => (
                                        <span key={cat} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                                            {cat}
                                        </span>
                                    ))
                                ) : (
                                    <span>Chưa cập nhật ngành hàng</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Call to Action (Fake for now) */}
                    <div className="border-t pt-4 mt-6 flex justify-center">
                        <p className="text-sm text-muted-foreground italic">
                            "Kết nối với tôi để trao đổi cơ hội hợp tác!"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
