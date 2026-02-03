import { searchGlobal } from "@/app/actions_search";
import PostCard from "@/components/feed/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams;
    const { users, posts } = await searchGlobal(q);

    return (
        <div className="container max-w-4xl py-6 space-y-8">
            <h1 className="text-2xl font-bold">Kết quả tìm kiếm cho "{q}"</h1>

            {/* Users Results */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase text-xs">Mọi người</h2>
                {users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {users.map((user: any) => (
                            <Link href={`/profile/${user.id}`} key={user.id}>
                                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:border-teal-500 transition-colors shadow-sm">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900">{user.full_name}</p>
                                        <p className="text-sm text-muted-foreground">{user.headline || "Thành viên"}</p>
                                        {user.zone && <p className="text-xs text-gray-500 mt-1">📍 {user.zone}</p>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">Không tìm thấy người dùng nào.</p>
                )}
            </section>

            {/* Posts Results */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase text-xs">Bài viết</h2>
                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map((post: any) => (
                            <PostCard key={post.id} {...post} author_id={post.author_id} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">Không tìm thấy bài viết nào.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
