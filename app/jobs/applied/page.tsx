import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Building, Calendar, MapPin, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default async function AppliedJobsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="container max-w-4xl mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
                <p className="mb-6">Bạn cần đăng nhập để xem lịch sử ứng tuyển.</p>
                <Link href="/login"><Button>Đăng nhập ngay</Button></Link>
            </div>
        );
    }

    // Fetch applications for current user with job details
    const { data: applications, error } = await supabase
        .from('job_applications')
        .select(`
            *,
            job:job_id (
                id,
                title,
                location,
                salary_range,
                company_name,
                status,
                recruiter:recruiter_id (
                    full_name,
                    avatar_url
                )
            )
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Việc làm đã ứng tuyển</h1>
                <p className="text-muted-foreground text-sm">Theo dõi trạng thái hồ sơ của bạn</p>
            </div>

            <div className="space-y-4">
                {applications && applications.length > 0 ? (
                    applications.map((app: any) => (
                        <div key={app.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            <Link href={`/jobs/${app.job?.id}`} className="hover:text-teal-600 hover:underline">
                                                {app.job?.title}
                                            </Link>
                                        </h3>
                                        <Badge variant={app.status === 'pending' ? 'secondary' : 'default'} className="uppercase text-[10px]">
                                            {app.status === 'pending' ? 'Đang chờ duyệt' : app.status}
                                        </Badge>
                                    </div>

                                    <div className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                                        <Building className="h-4 w-4 text-gray-400" />
                                        {app.job?.company_name || "Công ty ẩn danh"}
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {app.job?.location}
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Ứng tuyển {formatDistanceToNow(new Date(app.created_at), { addSuffix: true, locale: vi })}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:border-l md:pl-6 md:w-48 flex flex-col justify-center items-center gap-2">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
                                        <div className="font-bold text-teal-700 flex items-center gap-1 justify-center">
                                            <CheckCircle className="h-4 w-4" />
                                            Đã nộp
                                        </div>
                                    </div>
                                    <Link href={`/jobs/${app.job?.id}`} className="w-full">
                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                            Xem lại tin
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                        <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-bold text-gray-900 text-lg">Bạn chưa ứng tuyển việc làm nào</h3>
                        <p className="text-muted-foreground mb-6">Tìm kiếm cơ hội việc làm hấp dẫn ngay hôm nay.</p>
                        <Link href="/jobs">
                            <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                                Tìm việc ngay
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
