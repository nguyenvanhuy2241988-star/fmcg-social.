'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Award } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed or will be used, or fallback to alert

export default function InviteCard({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        // toast.success("Đã sao chép mã giới thiệu!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Tham gia FMCG Social',
            text: `Nhập mã ${code} để kết nối với cộng đồng Sales FMCG lớn nhất Việt Nam!`,
            url: window.location.origin
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" className="text-white" fill="currentColor" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                </svg>
            </div>

            <div className="relative z-10">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-1">Mời đồng đội</h3>
                <p className="text-teal-50 text-sm mb-4">Chia sẻ mã để xây dựng đội nhóm của bạn</p>

                <div className="bg-white/10 border border-white/20 rounded-lg p-3 flex items-center justify-between gap-3 mb-4 backdrop-blur-sm">
                    <code className="font-mono text-xl font-bold tracking-wider">{code || 'LOADING...'}</code>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 h-8 w-8"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>

                <Button
                    variant="secondary"
                    className="w-full bg-white text-teal-700 hover:bg-teal-50 font-bold border-0 shadow-md"
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ ngay
                </Button>
            </div>
        </div>
    );
}
