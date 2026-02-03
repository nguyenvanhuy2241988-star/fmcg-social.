
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Briefcase, Calendar, Edit, Share2 } from "lucide-react";
import ProfileEditWrapper from "@/components/profile/ProfileEditWrapper";
import { getConnectionStatus, getConnections } from "@/app/actions_connections";
import { ConnectButton } from "@/components/profile/ConnectButton";
import Link from "next/link";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // 1. Fetch Profile Data
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !profile) {
        console.error("Profile Error:", error);
        return (
            <div className="container py-10 text-center space-y-4">
                <p className="text-lg text-red-500">Không tìm thấy hồ sơ người dùng.</p>
                <div className="p-4 bg-gray-100 rounded text-left inline-block max-w-lg overflow-auto text-xs font-mono">
                    <p>Debug Info:</p>
                    <p>ID: {id}</p>
                    <p>Error: {JSON.stringify(error, null, 2)}</p>
                </div>
            </div>
        );
    }

    // 2. Check if current user is owner
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    const isOwner = currentUser?.id === profile.id;

    // 3. Get Connection Status & List
    let connectionStatus = 'none';
    let connections: any[] = [];

    // Parallel fetching
    const [statusRes, connectionsRes] = await Promise.all([
        (!isOwner && currentUser) ? getConnectionStatus(profile.id) : Promise.resolve('none'),
        getConnections(profile.id)
    ]);

    connectionStatus = statusRes as string;
    connections = connectionsRes;

    // 4. Status Color Logic
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
        <div className="container max-w-4xl py-8">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden relative">
                {/* Cover Background (Teal Gradient) */}
                <div className="h-40 bg-gradient-to-r from-teal-500 to-emerald-600"></div>

                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end -mt-12 mb-4">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-2xl font-bold bg-teal-100 text-teal-800">
                                {profile.full_name?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex gap-2 mb-1">
                            {isOwner ? (
                                <ProfileEditWrapper profile={profile} />
                            ) : (
                                currentUser && (
                                    <>
                                        <ConnectButton
                                            targetUserId={profile.id}
                                            initialStatus={connectionStatus as any}
                                        />
                                        {connectionStatus === 'accepted' && (
                                            <Link
                                                href={`/messages?id=${profile.id}`}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle mr-2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                                                Nhắn tin
                                            </Link>
                                        )}
                                    </>
                                )
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
                            <span>
                                {(isOwner || connectionStatus === 'accepted')
                                    ? (profile.phone || "Chưa cập nhật SĐT")
                                    : "Kết nối để xem SĐT"
                                }
                            </span>
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

            {/* Connections Section */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Mạng lưới kết nối ({connections.length})</h3>
                {connections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {connections.map((friend: any) => (
                            <div key={friend.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={friend.avatar_url} />
                                    <AvatarFallback>{friend.full_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900">{friend.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{friend.headline || "Thành viên"}</p>
                                    <a href={`/profile/${friend.id}`} className="text-xs text-teal-600 hover:underline">
                                        Xem hồ sơ
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Chưa có kết nối nào.</p>
                )}
            </div>
        </div>
    );
}
