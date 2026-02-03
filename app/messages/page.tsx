
import { createClient } from "@/utils/supabase/server";
import { getConnections } from "@/app/actions_connections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function MessagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div className="p-8 text-center">Vui lòng đăng nhập.</div>;
    }

    // Reuse getConnections to show list of friends to chat with
    // ideally should sort by last message, but for MVP list of friends is fine
    const connections = await getConnections(user.id);

    return (
        <div className="container max-w-2xl py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-teal-600" />
                Tin nhắn
            </h1>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {connections.length > 0 ? (
                    <div className="divide-y">
                        {connections.map((friend: any) => (
                            <Link
                                key={friend.id}
                                href={`/messages/${friend.id}`}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={friend.avatar_url} />
                                    <AvatarFallback>{friend.full_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-gray-900">{friend.full_name}</h3>
                                        {/* <span className="text-xs text-muted-foreground">12:30</span> */}
                                    </div>
                                    <p className="text-sm text-teal-600">Bấm để bắt đầu trò chuyện</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-muted-foreground">
                        <p className="mb-2">Bạn chưa có kết nối nào.</p>
                        <p className="text-sm">Hãy kết bạn để bắt đầu nhắn tin!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
