import PostCard from "@/components/feed/PostCard";
import CreatePost from "@/components/feed/CreatePost";
import { createClient } from "@/utils/supabase/server";
import { RequestItem } from "@/components/feed/RequestItem";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Posts
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        full_name,
        headline,
        avatar_url
      ),
      likes (
        user_id
      )
    `)
    .order('created_at', { ascending: false });

  // 2. Add has_liked field
  const formattedPosts = posts?.map((post) => ({
    ...post,
    has_liked: post.likes.some((like: any) => like.user_id === user?.id),
    author_id: post.author_id
  }));

  // 3. Fetch Pending Connection Requests
  let pendingRequests: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('connections')
      .select(`
        requester:requester_id (
          id,
          full_name,
          avatar_url,
          headline
        )
      `)
      .eq('receiver_id', user.id)
      .eq('status', 'pending');

    pendingRequests = data || [];
  }

  return (
    <div className="container py-6 grid md:grid-cols-[1fr_2fr_1fr] gap-6">
      {/* Sidebar Left */}
      <aside className="hidden md:block space-y-4">
        {/* 1. Identity Card */}
        {user && (
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-teal-500 to-emerald-600"></div>
            <div className="px-4 pb-4 -mt-8 text-center">
              <Link href={`/profile/${user.id}`}>
                <div className="inline-block p-1 bg-white rounded-full mb-2">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Ava" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-gray-500">Me</span>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 hover:text-teal-600 transition-colors">
                  {user.user_metadata?.full_name || "Thành viên mới"}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mb-3">{user.user_metadata?.headline || "Chào mừng bạn"}</p>

              <div className="grid grid-cols-2 gap-2 border-t pt-3 text-xs">
                <div className="text-center">
                  <span className="block font-bold text-gray-900">120</span>
                  <span className="text-gray-500">Xem hồ sơ</span>
                </div>
                <div className="text-center border-l">
                  <span className="block font-bold text-gray-900">{pendingRequests.length}</span>
                  <span className="text-gray-500">Lời mời</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Filters / Navigation */}
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="font-bold mb-3 text-sm uppercase text-gray-400">Khám phá</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2 p-2 rounded hover:bg-teal-50 hover:text-teal-700 cursor-pointer font-medium bg-teal-50/50 text-teal-700">
              <span>📰</span> Bảng tin chung
            </li>
            <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <span>💼</span> Việc làm Sales
            </li>
            <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <span>📈</span> Việc làm Marketing
            </li>
            <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <span>📚</span> Chia sẻ kiến thức
            </li>
            <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
              <span>🔖</span> Đã lưu
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="space-y-4">
        {/* Create Post Input */}
        <CreatePost user={user} />

        {/* Feed Items */}
        {formattedPosts?.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            author_id={post.author_id}
          />
        ))}

        {!formattedPosts?.length && (
          <div className="text-center text-muted-foreground py-10">
            Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
          </div>
        )}
      </main>

      {/* Sidebar Right */}
      <aside className="hidden md:block space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
              {pendingRequests.length}
            </span>
            Lời mời kết nối
          </h3>

          {pendingRequests.length > 0 ? (
            pendingRequests.map((req: any) => (
              <RequestItem key={req.requester.id} request={req} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có lời mời nào.</p>
          )}

          <div className="mt-6 border-t pt-4">
            <h3 className="font-bold mb-2 text-sm text-gray-500 uppercase">Gợi ý kết nối</h3>
            <p className="text-sm text-muted-foreground">Tính năng đang phát triển...</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
