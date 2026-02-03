
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
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-gray-50/50">
                            <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="h-8 w-8 text-teal-600" />
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900">Mạng lưới kết nối FMCG Social</h3>
                            <p className="max-w-xs mt-2">Chọn một người bạn từ danh sách bên trái để bắt đầu cuộc trò chuyện.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
