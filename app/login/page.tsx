
import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { LoginForm, RegisterForm } from "@/components/auth/AuthForms"

export default function LoginPage() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                    <TabsTrigger value="register">Đăng ký</TabsTrigger>
                </TabsList>

                {/* LOGIN TAB */}
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Chào mừng trở lại!</CardTitle>
                            <CardDescription>
                                Đăng nhập để kết nối với mạng lưới FMCG.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LoginForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* REGISTER TAB */}
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tạo tài khoản mới</CardTitle>
                            <CardDescription>
                                Tham gia cộng đồng FMCG lớn nhất Việt Nam.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RegisterForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
