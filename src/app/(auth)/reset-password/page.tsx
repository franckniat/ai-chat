import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react"

export default function ResetPasswordPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
                <Suspense>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
