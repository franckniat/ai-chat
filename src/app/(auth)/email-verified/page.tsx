import VerificationForm from "@/components/auth/verified-email";
import { Suspense } from "react"

export default function VerifiedEmailPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
                <Suspense>
                    <VerificationForm/>
                </Suspense>
            </div>
        </div>
    )
}
