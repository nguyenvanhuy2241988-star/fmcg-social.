import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Users, Eye, Edit, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default async function ManageJobsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="container max-w-4xl mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
                <p className="mb-6">Bạn cần đăng nhập để quản lý tin tuyển dụng.</p>
                <Link href="/login"><Button>Đăng nhập ngay</Button></Link>
            </div>
        );
    }

    // Fetch jobs posted by current user with application count
    const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
            *,
            job_applications (count)
        `)
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý tuyển dụng</h1>
                    <p className="text-muted-foreground text-sm">Xem danh sách tin đã đăng và hồ sơ ứng viên</p>
                </div>
                <Link href="/jobs/new">
                    <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="h-4 w-4 mr-2" /> Đăng tin mới
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {jobs && jobs.length > 0 ? (
                    jobs.map((job: any) => (
                        <div key={job.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        <Link href={`/jobs/${job.id}`} className="hover:text-teal-600 hover:underline">
                                            {job.title}
                                        </Link>
                                    </h3>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {job.status === 'active' ? 'Đang tuyển' : 'Đã đóng'}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: vi })}</span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                    <div className="flex-1 md:flex-none text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 min-w-[100px]">
                                        <div className="text-2xl font-bold text-blue-700">
                                            {job.job_applications?.[0]?.count || 0}
                                        </div>
                                        <div className="text-xs text-blue-600 font-medium">Ứng viên</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/jobs/${job.id}`}>
                                            <Button variant="outline" size="icon" title="Xem chi tiết & Ứng viên">
                                                <Users className="h-4 w-4 text-gray-600" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" disabled title="Chỉnh sửa (Sắp ra mắt)">
                                            <Edit className="h-4 w-4 text-gray-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                        <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold text-gray-900 text-lg">Bạn chưa đăng tin tuyển dụng nào</h3>
                        <p className="text-muted-foreground mb-6">Đăng tin ngay để tìm kiếm nhân tài cho doanh nghiệp của bạn.</p>
                        <Link href="/jobs/new">
                            <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                                Đăng tin đầu tiên
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
