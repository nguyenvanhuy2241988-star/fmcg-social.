'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { submitVerificationRequest } from "@/app/actions_admin";
import { Loader2, ShieldCheck, UploadCloud } from "lucide-react";

export default function VerifyPage() {
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl) return;

        setIsLoading(true);
        setError('');

        try {
            const res = await submitVerificationRequest(imageUrl);
            if (res.error) {
                setError(res.error);
            } else {
                setSubmitted(true);
            }
        } catch (err) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container max-w-md mx-auto py-20 px-4">
                <Card className="text-center py-10">
                    <CardContent>
                        <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã gửi yêu cầu!</h2>
                        <p className="text-muted-foreground">
                            Hệ thống đang xem xét hồ sơ của bạn.<br />
                            Vui lòng chờ thông báo trong 24h.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-md mx-auto py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                        Xác minh danh tính
                    </CardTitle>
                    <CardDescription>
                        Nhận tích xanh uy tín để tăng độ tin cậy khi tuyển dụng hoặc tìm việc.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link ảnh CCCD/CMND (Mặt trước)</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://example.com/cmnd.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                *Demo: Bạn có thể dán bất kỳ link ảnh nào để test.
                            </p>
                        </div>

                        {imageUrl && (
                            <div className="rounded-lg border overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
                                <img src={imageUrl} alt="Preview" className="h-full object-contain" />
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
                            Gửi yêu cầu xác minh
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
