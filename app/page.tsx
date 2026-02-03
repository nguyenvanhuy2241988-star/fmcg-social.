import PostCard from "@/components/feed/PostCard";
import CreatePost from "@/components/feed/CreatePost";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        full_name,
        headline,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="container py-6 grid md:grid-cols-[1fr_2fr_1fr] gap-6">
      {/* Sidebar Left */}
      <aside className="hidden md:block space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-bold mb-2">Bộ lọc</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary cursor-pointer">Tất cả</li>
            <li className="hover:text-primary cursor-pointer">Việc làm Sales</li>
            <li className="hover:text-primary cursor-pointer">Việc làm Marketing</li>
            <li className="hover:text-primary cursor-pointer">Chia sẻ kiến thức</li>
          </ul>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="space-y-4">
        {/* Create Post Input */}
        <CreatePost user={user} />

        {/* Feed Items */}
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            {...post}
          />
        ))}

        {!posts?.length && (
          <div className="text-center text-muted-foreground py-10">
            Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
          </div>
        )}
      </main>

      {/* Sidebar Right */}
      <aside className="hidden md:block space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-bold mb-2">Gợi ý kết nối</h3>
          <p className="text-sm text-muted-foreground">Chưa có gợi ý nào.</p>
        </div>
      </aside>
    </div>
  );
}
