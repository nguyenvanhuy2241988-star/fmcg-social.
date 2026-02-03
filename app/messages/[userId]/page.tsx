
import { createClient } from "@/utils/supabase/server";
import ChatWindow from "@/components/chat/ChatWindow";
import { redirect } from "next/navigation";

export default async function MessagePage({ params }: { params: Promise<{ userId: string }> }) {
    const supabase = await createClient();
    const { userId: partnerId } = await params;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Partner Profile
    const { data: partner } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", partnerId)
        .single();

    if (!partner) {
        return <div className="p-8 text-center">Người dùng không tồn tại.</div>;
    }

    return (
        <div className="container max-w-2xl py-8 h-[calc(100vh-64px)]">
            <h1 className="text-xl font-bold mb-4">Chat với {partner.full_name}</h1>
            <ChatWindow currentUser={user} partner={partner} />
        </div>
    );
}
