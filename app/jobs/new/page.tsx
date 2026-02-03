import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewJobForm from "@/components/jobs/NewJobForm";

export default function NewJobPage() {
    return (
        <div className="container max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6 space-y-4">
                <Link href="/jobs">
                    <Button variant="ghost" size="sm" className="gap-1 pl-0 text-muted-foreground hover:text-teal-600">
                        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Đăng tin tuyển dụng mới</h1>
                    <p className="text-muted-foreground text-sm">Tìm kiếm nhân tài FMCG nhanh chóng</p>
                </div>
            </div>

            <NewJobForm />
        </div>
    );
}
