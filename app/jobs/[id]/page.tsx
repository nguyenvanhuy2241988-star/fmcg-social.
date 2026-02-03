import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Briefcase, Calendar, Building, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { applyForJob } from "@/app/actions_jobs"; // We will add this action next
import { notFound } from "next/navigation";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params first in Next.js 15+ convention (if applicable, but safe to do)
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Job Details
    const { data: job, error } = await supabase
        .from('jobs')
        .select(`
            *,
            recruiter:recruiter_id (
                id,
                full_name,
                avatar_url,
                headline
            )
        `)
        .eq('id', id)
        .single();

    if (error || !job) {
        notFound();
    }

    // Check if current user has already applied
    const { data: { user } } = await supabase.auth.getUser();
    let hasApplied = false;

    if (user) {
        const { data: application } = await supabase
            .from('job_applications')
            .select('id')
            .eq('job_id', id)
            .eq('applicant_id', user.id)
            .single();
        if (application) hasApplied = true;
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <Link href="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600 mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại danh sách việc làm
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                <div className="text-lg font-medium text-gray-700 mb-4">{job.company_name || "Công ty ẩn danh"}</div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-1 font-medium text-emerald-600">
                                        <DollarSign className="h-4 w-4" /> {job.salary_range}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" /> {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: vi })}
                                    </div>
                                </div>
                            </div>
                            {/* Company Logo Placeholder */}
                            <div className="h-16 w-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <Building className="h-8 w-8 text-gray-400" />
                            </div>
                        </div>

                        {/* Apply Action */}
                        <div className="mt-8 pt-6 border-t flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                {hasApplied ? (
                                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                                        ✅ Bạn đã ứng tuyển vị trí này
                                    </span>
                                ) : (
                                    "Ứng tuyển ngay để không bỏ lỡ cơ hội!"
                                )}
                            </div>

                            {!hasApplied ? (
                                <form action={async () => {
                                    'use server';
                                    await applyForJob(id);
                                }}>
                                    <Button className="bg-teal-600 hover:bg-teal-700 min-w-[150px]">
                                        Nộp hồ sơ ngay
                                    </Button>
                                </form>
                            ) : (
                                <Button disabled variant="outline">Đã ứng tuyển</Button>
                            )}
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Mô tả công việc</h3>
                            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                                {job.description || "Chưa có mô tả chi tiết."}
                            </div>
                        </div>

                        {job.requirements && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">Yêu cầu công việc</h3>
                                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                                    {job.requirements}
                                </div>
                            </div>
                        )}

                        {job.benefits && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">Quyền lợi</h3>
                                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                                    {job.benefits}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Recruiter Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-20">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Nhà tuyển dụng</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={job.recruiter?.avatar_url} />
                                <AvatarFallback>{job.recruiter?.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-bold text-gray-900">{job.recruiter?.full_name}</div>
                                <div className="text-xs text-gray-500 line-clamp-1">{job.recruiter?.headline || "Nhà tuyển dụng"}</div>
                            </div>
                        </div>
                        <Link href={`/profile/${job.recruiter?.id}`}>
                            <Button variant="outline" className="w-full">Xem hồ sơ</Button>
                        </Link>
                    </div>

                    {/* Safety Tips (Content-Led) */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            🛡️ Mẹo an toàn
                        </h4>
                        <ul className="space-y-2 list-disc pl-4 text-blue-700/90">
                            <li>Không nộp tiền phí đặt cọc.</li>
                            <li>Tìm hiểu kỹ về công ty trước khi đến phỏng vấn.</li>
                            <li>Báo cáo tin tuyển dụng nếu có dấu hiệu lừa đảo.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
