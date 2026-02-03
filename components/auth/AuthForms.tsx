"use client"

import { useState } from "react"
import { login, signup, signInWithGoogle } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function GoogleLoginButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        await signInWithGoogle()
        // No need to set loading false because we redirect
    };

    return (
        <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
            )}
            Đăng nhập bằng Gmail
        </Button>
    )
}

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const res = await login(formData)
        setIsLoading(false)

        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Đăng nhập thất bại",
                description: res.error,
            })
        }
    }

    return (
        <div className="space-y-4">
            <GoogleLoginButton />
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Hoặc tiếp tục với Email
                    </span>
                </div>
            </div>
            <form action={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="name@company.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Đăng nhập
                </Button>
            </form>
        </div>
    )
}

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const res = await signup(formData)
        setIsLoading(false)

        if (res?.error) {
            toast({
                variant: "destructive",
                title: "Đăng ký thất bại",
                description: res.error,
            })
        } else {
            toast({
                title: "Đăng ký thành công",
                description: "Vui lòng kiểm tra email để xác thực (nếu bật) hoặc đăng nhập ngay.",
            })
        }
    }

    return (
        <div className="space-y-4">
            <GoogleLoginButton />
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Hoặc đăng ký với Email
                    </span>
                </div>
            </div>
            <form action={handleSubmit} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Đăng ký
                </Button>
            </form>
        </div>
    )
}
