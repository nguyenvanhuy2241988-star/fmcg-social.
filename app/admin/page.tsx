'use client';

import { useEffect, useState } from 'react';
import { getVerificationRequests, approveVerification, rejectVerification } from "@/app/actions_admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function AdminPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setIsLoading(true);
        const data = await getVerificationRequests();
        setRequests(data);
        setIsLoading(false);
    };

    const handleApprove = async (reqId: string, userId: string) => {
        setActionLoading(reqId);
        await approveVerification(reqId, userId);
        setRequests(prev => prev.filter(r => r.id !== reqId));
        setActionLoading(null);
    };

    const handleReject = async (reqId: string) => {
        setActionLoading(reqId);
        await rejectVerification(reqId);
        setRequests(prev => prev.filter(r => r.id !== reqId));
        setActionLoading(null);
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="container max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="h-8 w-8 text-red-600" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Quản lý và xét duyệt hồ sơ</p>
                </div>
                {/* Debug Info */}
                <div className="ml-auto px-3 py-1 bg-gray-100 rounded text-xs text-gray-500">
                    Role Check: {requests === null ? 'Checking...' : (requests.length >= 0 ? 'Admin Access OK' : 'Access Denied')}
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Yêu cầu xác minh ({requests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {requests.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Không có yêu cầu nào đang chờ xử lý.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.map((req) => (
                                    <div key={req.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-xl hover:bg-gray-50">
                                        {/* User Info */}
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <Avatar>
                                                <AvatarImage src={req.profile?.avatar_url} />
                                                <AvatarFallback>{req.profile?.full_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-bold">{req.profile?.full_name}</div>
                                                <div className="text-xs text-gray-500">{req.profile?.email}</div>
                                                <div className="text-xs text-blue-600 mt-1">
                                                    {formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: vi })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Proof Image */}
                                        <div className="flex-1 bg-gray-100 rounded-lg p-2 flex justify-center items-center h-48 md:h-32 overflow-hidden group cursor-pointer relative">
                                            <img src={req.image_url} alt="KYC" className="h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                                                Click để xem ảnh gốc (Demo: Open in new tab)
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col gap-2 justify-center min-w-[120px]">
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 w-full"
                                                size="sm"
                                                onClick={() => handleApprove(req.id, req.user_id)}
                                                disabled={!!actionLoading}
                                            >
                                                {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                                                Duyệt
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleReject(req.id)}
                                                disabled={!!actionLoading}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Từ chối
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
