import PostCard from "@/components/feed/PostCard";
import CreatePost from "@/components/feed/CreatePost";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Mock data for now (will be replaced by real data later)
  const posts = [
    {
      id: 1,
      author: { name: "Nguyễn Văn A", role: "Sales Supervisor @ Unilever" },
      content: "Tuyển gấp 5 bạn Sales Rep khu vực Hà Nội. Lương cứng 8tr + Thưởng. Chế độ đầy đủ. Anh em nào quan tâm inbox nhé!",
      timestamp: "2 giờ trước",
      likes: 45,
      comments: 12,
    },
    {
      id: 2,
      author: { name: "Trần Thị B", role: "Key Account Manager @ Masan" },
      content: "Vừa hoàn thành dự án trưng bày Tết. Cảm ơn team đã chiến đấu hết mình! 🏮🌸 #FMCG #TradeMarketing",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
      timestamp: "5 giờ trước",
      likes: 128,
      comments: 34,
    },
  ];

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
        {posts.map((post) => (
          <PostCard
            key={post.id}
            author={post.author}
            content={post.content}
            imageUrl={post.imageUrl}
            timestamp={post.timestamp}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
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
