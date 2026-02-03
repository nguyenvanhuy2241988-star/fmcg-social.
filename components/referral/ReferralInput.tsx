'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyReferralCode } from "@/app/actions_referral";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ReferralInput() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await applyReferralCode(code.trim().toUpperCase());

            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Chúc mừng! Bạn đã gia nhập đội nhóm thành công.' });
                setCode('');
                router.refresh();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2">Nhập mã giới thiệu</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Nếu bạn được bạn bè giới thiệu, hãy nhập mã của họ để kết nối.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                    <Input
                        placeholder="VD: TUAN123"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="uppercase font-mono"
                        maxLength={8}
                    />
                    <Button type="submit" disabled={isLoading || !code}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xác nhận'}
                    </Button>
                </div>

                {message && (
                    <div className={`text-sm flex items-center gap-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
}
