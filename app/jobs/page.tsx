import { getJobs } from "@/app/actions_jobs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MapPin, DollarSign, Briefcase } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default async function JobsPage() {
    const jobs = await getJobs();

    return (
        <div className="container max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Việc làm FMCG</h1>
                    <p className="text-muted-foreground text-sm">Cơ hội việc làm hot nhất ngành hàng tiêu dùng</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/jobs/manage">
                        <Button variant="outline" className="hidden sm:flex">
                            Quản lý tin đăng
                        </Button>
                    </Link>
                    <Link href="/jobs/new">
                        <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-0 shadow-md hover:shadow-lg transition-all">
                            Đăng tin tuyển dụng
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
                {/* Main Job List */}
                <div className="space-y-4">
                    {jobs.length > 0 ? (
                        jobs.map((job: any) => (
                            <div key={job.id} className="bg-white border rounded-xl p-4 hover:border-teal-500 transition-colors shadow-sm group">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border shrink-0">
                                        <Briefcase className="h-6 w-6 text-gray-500 group-hover:text-teal-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">
                                                {job.title}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: vi })}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            {job.company_name || job.recruiter?.full_name || "Công ty ẩn danh"}
                                        </p>

                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4 text-gray-400" />
                                                <span className="text-emerald-600 font-medium">{job.salary_range}</span>
                                            </div>
                                            {job.category && (
                                                <div className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                                                    {job.category}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={job.recruiter?.avatar_url} />
                                                <AvatarFallback>{job.recruiter?.full_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-gray-500">
                                                Đăng bởi <span className="font-medium text-gray-700">{job.recruiter?.full_name}</span>
                                            </span>
                                            <div className="ml-auto">
                                                <Link href={`/jobs/${job.id}`}>
                                                    <Button size="sm" variant="outline" className="h-8 rounded-full hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200">
                                                        Xem chi tiết
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="font-bold text-gray-900">Chưa có tin tuyển dụng nào</h3>
                            <p className="text-muted-foreground text-sm mb-4">Hãy là người đầu tiên đăng tin tuyển dụng!</p>
                            <Link href="/jobs/new">
                                <Button variant="outline">Đăng tin ngay</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Filters (Placeholder) */}
                <div className="hidden md:block space-y-4">
                    <div className="bg-white rounded-xl border p-4 shadow-sm sticky top-20">
                        <h3 className="font-bold text-gray-900 mb-3">Bộ lọc</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Khu vực</label>
                                <select className="w-full text-sm border-gray-200 rounded-md bg-gray-50 p-2">
                                    <option>Tất cả</option>
                                    <option>Hà Nội</option>
                                    <option>Hồ Chí Minh</option>
                                    <option>Đà Nẵng</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Mức lương</label>
                                <select className="w-full text-sm border-gray-200 rounded-md bg-gray-50 p-2">
                                    <option>Mọi mức lương</option>
                                    <option>Dưới 10 triệu</option>
                                    <option>10 - 20 triệu</option>
                                    <option>Trên 20 triệu</option>
                                </select>
                            </div>
                            <Button className="w-full mt-2" variant="secondary">Áp dụng</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
