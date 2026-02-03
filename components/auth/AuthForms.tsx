"use client"

import { useState } from "react"
import { login, signup } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

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
    )
}
