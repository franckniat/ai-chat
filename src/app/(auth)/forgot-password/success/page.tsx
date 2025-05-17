"use client";

import { Check } from "lucide-react";

export default function ForgotPasswordSuccess() {


    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <Check size={26} />
                <h1 className="text-2xl font-bold">Success</h1>
            </div>
            <p className="text-muted-foreground">
                We have sent you a link to reset your password.
            </p>
        </div>
    );
}
