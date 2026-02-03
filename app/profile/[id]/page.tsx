
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Briefcase, Calendar, Edit, Share2 } from "lucide-react";
import ProfileEditWrapper from "@/components/profile/ProfileEditWrapper";
import { getConnectionStatus, getConnections } from "@/app/actions_connections";
import { ConnectButton } from "@/components/profile/ConnectButton";
import Link from "next/link";
import PostCard from "@/components/feed/PostCard";
import { getUserPosts } from "@/app/actions_posts";
import SuggestedConnections from "@/components/feed/SuggestedConnections";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

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

    // 5. Fetch User's Posts
    const userPosts = await getUserPosts(profile.id);

    return (

        <div className="container max-w-6xl mx-auto px-4 py-6">
            {/* 1. COVER & HEADER SECTION */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden relative mb-6">
                <div className="h-48 bg-gradient-to-r from-teal-600 to-emerald-600"></div>
                <div className="px-8 pb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4 gap-6">
                        <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-4xl font-bold bg-teal-50 text-teal-800">
                                {profile.full_name?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                {profile.full_name}
                                {profile.is_verified && <VerifiedBadge size={28} />}
                            </h1>
                            <p className="text-lg text-teal-700 font-medium mb-1">{profile.headline || "Thành viên Cộng đồng FMCG"}</p>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColors[currentStatus]}`}>
                                {statusLabels[currentStatus]}
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4 md:mb-2">
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
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6">
                {/* 2. LEFT SIDEBAR: INTRO & PHOTOS & FRIENDS */}
                <div className="space-y-6">
                    {/* Intro Card */}
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <h2 className="font-bold text-lg mb-4">Giới thiệu</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center text-gray-700">
                                <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                                <span className="flex-1">{profile.headline || "--"}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{profile.zone || "Chưa cập nhật nơi ở"}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                <span>
                                    {(isOwner || connectionStatus === 'accepted')
                                        ? (profile.phone || "Chưa cập nhật SĐT")
                                        : "Kết bạn để xem SĐT"
                                    }
                                </span>
                            </div>
                            <div className="border-t pt-3 mt-2">
                                <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Ngành hàng quan tâm</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.categories?.map((cat: string) => (
                                        <span key={cat} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">{cat}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Friends Card */}
                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="font-bold text-lg">Bạn bè</h2>
                                <p className="text-xs text-muted-foreground">{connections.length} người bạn</p>
                            </div>
                            <Link href="#" className="text-teal-600 text-sm hover:underline">Xem tất cả</Link>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {connections.slice(0, 9).map((friend) => (
                                <Link key={friend.id} href={`/profile/${friend.id}`} className="block group">
                                    <Avatar className="h-full w-full aspect-square rounded-lg border-0">
                                        <AvatarImage src={friend.avatar_url} className="object-cover rounded-lg" />
                                        <AvatarFallback className="rounded-lg">{friend.full_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-[10px] font-medium mt-1 truncate group-hover:underline">{friend.full_name}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. CENTER COLUMN: POSTS FEED */}
                <div className="space-y-4">
                    {/* Create Post (Only for Owner) */}
                    {isOwner && (
                        <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
                            <div className="flex gap-3">
                                <Avatar>
                                    <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                                    <AvatarFallback>Me</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-gray-100 rounded-full px-4 flex items-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                                    Bạn đang nghĩ gì thế?
                                </div>
                            </div>
                        </div>
                    )}

                    <h3 className="font-bold text-lg px-1">Bài viết</h3>

                    {userPosts.length > 0 ? (
                        userPosts.map((post: any) => (
                            <PostCard key={post.id} {...post} author_id={post.author_id} />
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-muted-foreground">
                            <p>Chưa có bài viết nào.</p>
                        </div>
                    )}
                </div>

                {/* 4. RIGHT SIDEBAR: SUGGESTIONS (LinkedIn Style) */}
                <div className="hidden lg:block space-y-4">
                    <SuggestedConnections />

                    <div className="bg-white rounded-xl shadow-sm border p-4">
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">Việc làm mới</h3>
                        <p className="text-sm text-muted-foreground">Tính năng đang phát triển...</p>
                    </div>

                    <div className="text-xs text-gray-400 text-center px-4">
                        FMCG Social © 2025<br />
                        Kết nối nhân tài ngành tiêu dùng nhanh
                    </div>
                </div>
            </div>
        </div>
    );
}
