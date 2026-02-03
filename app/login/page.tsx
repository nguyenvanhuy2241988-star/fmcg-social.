
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
                        <form action={async (formData) => {
                            'use server'
                            await login(formData)
                        }}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="name@company.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Đăng nhập</Button>
                            </CardFooter>
                        </form>
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
                        <form action={async (formData) => {
                            'use server'
                            await signup(formData)
                        }}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Họ và tên</Label>
                                    <Input id="fullName" name="fullName" placeholder="Nguyễn Văn A" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="name@company.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Đăng ký</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
