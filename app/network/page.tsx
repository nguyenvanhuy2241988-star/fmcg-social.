import { createClient } from "@/utils/supabase/server";
import { getReferralCode, getReferralStats, getMyReferrer } from "@/app/actions_referral";
import InviteCard from "@/components/referral/InviteCard";
import ReferralInput from "@/components/referral/ReferralInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default async function NetworkPage() {
    const referralCode = await getReferralCode();
    const { count, list } = await getReferralStats();
    const myReferrer: any = await getMyReferrer();

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Invite Card & Summary */}
                <div className="space-y-6">
                    {referralCode && <InviteCard code={referralCode} />}

                    <ReferralInput />

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 uppercase">Tổng thành viên</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{count}</div>
                            <p className="text-xs text-muted-foreground mt-1">Người đã nhập mã của bạn</p>
                        </CardContent>
                    </Card>

                    {myReferrer && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-blue-600 uppercase mb-3">Người giới thiệu tôi</h4>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={myReferrer.avatar_url} />
                                    <AvatarFallback>{myReferrer.full_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{myReferrer.full_name}</div>
                                    <div className="text-xs text-muted-foreground">{myReferrer.headline || "Thành viên"}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: List of Referees */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="h-6 w-6 text-teal-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Đội nhóm của tôi</h2>
                    </div>

                    {list.length > 0 ? (
                        <div className="bg-white rounded-xl border shadow-sm divide-y">
                            {list.map((user: any) => (
                                <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar_url} />
                                        <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{user.full_name}</h4>
                                        <p className="text-xs text-muted-foreground">{user.headline || "Thành viên mới"}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: vi })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="font-bold text-gray-900">Chưa có thành viên nào</h3>
                            <p className="text-muted-foreground text-sm mb-4">Chia sẻ mã giới thiệu để xây dựng cộng đồng của riêng bạn!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
