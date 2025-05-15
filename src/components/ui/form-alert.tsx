"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, CircleCheck } from "lucide-react";

interface FormAlertProps {
    title: string;
    description: string;
    variant?: "default" | "destructive" | "warning" | "success";
}

export function FormAlert({ title, description, variant = "default" }: FormAlertProps) {
    return (
        <Alert variant={variant} className="flex items-center gap-3 w-full">
            {variant === "destructive" && (
                <CircleAlert size={25} className=" text-destructive"/>
            )}
            {variant === "warning" && (
                <CircleAlert size={25} className="text-warning"/>
            )}
            {variant === "success" && (
                <CircleCheck size={25}/>
            )}
            <div className="space-y-1">
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription className="text-sm text-foreground/50">{description}</AlertDescription>
            </div>
        </Alert>
    );
}
