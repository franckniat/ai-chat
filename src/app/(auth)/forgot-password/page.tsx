import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Suspense } from "react"

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
                <Suspense>
                    <ForgotPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
