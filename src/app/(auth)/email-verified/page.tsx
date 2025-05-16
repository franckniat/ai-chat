import VerificationForm from "@/components/auth/verified-email";

export default function VerifiedEmailPage() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
                <VerificationForm/>
            </div>
        </div>
    )
}
