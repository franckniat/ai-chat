
import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login to your account | niato ai",
    description: "Login to your account"
}

export default function LoginPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
                <LoginForm />
            </div>
        </div>
    )
}
