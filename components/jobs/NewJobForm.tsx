"use client";

import { createJob } from "@/app/actions_jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
// import { useFormState } from "react-dom"; // Backwards compatibility if needed

const initialState = {
    error: "",
    message: ""
};

export default function NewJobForm() {
    const [state, formAction, isPending] = useActionState(createJob, initialState);

    return (
        <form action={formAction} className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                    {state.error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tiêu đề công việc <span className="text-red-500">*</span></label>
                <Input name="title" required placeholder="VD: Nhân viên kinh doanh, Sales Sup, Kế toán kho..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tên công ty / NPP</label>
                    <Input name="company_name" placeholder="VD: NPP Hưng Thịnh" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ngành nghề</label>
                    <select name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="Sales">Sales / Kinh doanh</option>
                        <option value="Kho vẫn">Kho vận / Giao hàng</option>
                        <option value="Kế toán">Kế toán / Admin</option>
                        <option value="Marketing">Marketing / PG</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Khu vực làm việc <span className="text-red-500">*</span></label>
                    <Input name="location" required placeholder="VD: Quận Cầu Giấy, Hà Nội" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mức lương <span className="text-red-500">*</span></label>
                    <Input name="salary_range" required placeholder="VD: 8 - 12 triệu + Thưởng" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mô tả công việc</label>
                <Textarea
                    name="description"
                    rows={5}
                    placeholder="Mô tả chi tiết công việc, quyền lợi, yêu cầu..."
                />
            </div>

            <div className="pt-4 flex gap-4">
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isPending}>
                    {isPending ? "Đang đăng tin..." : "Đăng tin"}
                </Button>
            </div>
        </form>
    );
}
