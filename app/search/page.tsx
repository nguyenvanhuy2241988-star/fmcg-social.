import { searchGlobal } from "@/app/actions_search";
import PostCard from "@/components/feed/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams;
    const { users, posts } = await searchGlobal(q);

    return (
        <div className="container max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
                Kết quả tìm kiếm cho <span className="text-teal-600">"{q}"</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
                {/* Left Column: Users Results */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Mọi người</h2>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{users.length}</span>
                    </div>

                    {users.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {users.map((user: any) => (
                                <Link href={`/profile/${user.id}`} key={user.id}>
                                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border hover:border-teal-500 hover:shadow-md transition-all">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-gray-900 truncate">{user.full_name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.headline || "Thành viên"}</p>
                                            {user.zone && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                                                    <span>📍</span> {user.zone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center border rounded-xl bg-gray-50 border-dashed">
                            <p className="text-muted-foreground text-sm">Không tìm thấy ai.</p>
                        </div>
                    )}
                </section>

                {/* Right Column: Posts Results */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Bài viết liên quan</h2>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{posts.length}</span>
                    </div>

                    <div className="space-y-4 max-w-3xl">
                        {posts.length > 0 ? (
                            posts.map((post: any) => (
                                <PostCard key={post.id} {...post} author_id={post.author_id} />
                            ))
                        ) : (
                            <div className="p-12 text-center border rounded-xl bg-gray-50 border-dashed">
                                <p className="text-muted-foreground text-sm mb-2">Không tìm thấy bài viết nào chứa từ khóa này.</p>
                                <p className="text-xs text-gray-400">Hãy thử tìm với từ khóa khác xem sao!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
