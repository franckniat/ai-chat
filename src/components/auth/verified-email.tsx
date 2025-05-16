"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { betterFetch } from "@better-fetch/fetch";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Session } from "@/lib/auth";
import { toast } from "sonner";

export default function VerificationForm() {
    const params = useSearchParams();
    const token = params.get("token");

    useEffect(() => {
        const fetchToken = async () => {
            if (token) {
                const res = await betterFetch<{ status: boolean, user: Session }>(`/api/auth/verify-email?token=${token}`);
                if (res.data?.status === true) {
                    toast.success("Email verified successfully", {
                        description: "Your email has been verified successfully!",
                    })
                }
            }
        }
        fetchToken()
    }, [token]);

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-bold">Email Verification</h1>
            <p className="text-muted-foreground">
                Your email has been verified successfully!
            </p>
            <Link href="/chat" className={buttonVariants({ variant: "default" })}>Go to home</Link>
        </div>
    );
}
