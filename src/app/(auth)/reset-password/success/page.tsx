"use client";

import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordSuccess() {


    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <Check size={26} />
                <h1 className="text-2xl font-bold">Success</h1>
            </div>
            <p className="text-muted-foreground">
                Your password has been reset.
            </p>
            <Link href="/login" className={buttonVariants({ variant: "default" })}>
                Login
            </Link>
        </div>
    );
}
