
import { createClient } from "@/utils/supabase/server";
import { getConnections } from "@/app/actions_connections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import ChatWindow from "@/components/chat/ChatWindow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";

export default async function MessagesLayout({ params, searchParams }: { params: Promise<{ userId?: string }>, searchParams: Promise<{ id?: string }> }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Please login</div>;

    const connections = await getConnections(user.id);

    // Determine selected partner from URL query or first connection
    const { id: selectedId } = await searchParams;
    const activePartnerId = selectedId;

    const activePartner = connections.find((c: any) => c.id === activePartnerId);

    return (
        <div className="container max-w-6xl py-6 h-[calc(100vh-64px)]">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full border rounded-xl overflow-hidden shadow-sm bg-white">
                {/* Left Sidebar: Conversation List */}
                <div className="border-r flex flex-col bg-gray-50">
                    <div className="p-4 border-b bg-white">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-teal-600" />
                            Trò chuyện
                        </h2>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {connections.map((friend: any) => (
                                <Link
                                    key={friend.id}
                                    href={`/messages?id=${friend.id}`}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activePartnerId === friend.id
                                        ? "bg-teal-50 text-teal-900 border-l-4 border-teal-500 shadow-sm"
                                        : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                        <AvatarImage src={friend.avatar_url} />
                                        <AvatarFallback>{friend.full_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-sm">{friend.full_name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{friend.headline || "Thành viên"}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Area: Chat Window */}
                <div className="flex flex-col h-full bg-white">
                    {activePartner ? (
                        <ChatWindow currentUser={user} partner={activePartner} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50/50">
                            <div className="h-20 w-20 bg-teal-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <MessageSquare className="h-10 w-10 text-teal-600" />
                            </div>
                            <h3 className="font-bold text-2xl text-gray-900 mb-2">Chào mừng đến với FMCG Chat</h3>
                            <p className="text-muted-foreground mb-8 text-center max-w-md">
                                Chọn một người bạn từ danh sách bên trái để bắt đầu trò chuyện hoặc kết nối với những người bạn mới.
                            </p>

                            {/* Suggestions Grid for Empty State */}
                            <div className="w-full max-w-2xl bg-white rounded-xl border p-6 shadow-sm">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>🚀</span> Gợi ý kết nối nhanh
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Using Mock Data inline or import Component but customized */}
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="border rounded-lg p-3 flex flex-col items-center text-center hover:border-teal-500 transition-colors cursor-pointer group">
                                            <Avatar className="h-12 w-12 mb-2">
                                                <AvatarFallback>U{i}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-medium text-sm group-hover:text-teal-600">Thành viên FMCG {i}</p>
                                            <p className="text-xs text-muted-foreground mb-2">Sales Supervisor</p>
                                            <button className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                                Kết nối ngay
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
