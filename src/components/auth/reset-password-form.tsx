"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormMessage, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { resetPasswordSchema, ResetPasswordSchema } from "@/schemas/user";
import { useSearchParams, useRouter } from "next/navigation";

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        }
    })
    const token = useSearchParams().get("token");
    const onSubmit = async (data: ResetPasswordSchema) => {
        startTransition(async () => {
            if (!token) {
                toast.error("Invalid token");
                return;
            }
            if (data.password !== data.passwordConfirmation) {
                toast.error("Passwords do not match", {
                    description: "You have to enter the same password in both fields.",
                });
                return;
            }
            await authClient.resetPassword({
                newPassword: data.password,
                token: token as string,
            }, {
                onRequest: () => {
                    toast.info("Please wait ...")
                },
                onSuccess: async () => {
                    toast.success("Password reset", {
                        description: "Your password has been reset.",
                    })
                    router.push("/reset-password/success")
                },
                onError: (error) => {
                    console.log(error)
                    toast.error("Something went wrong", {
                        description: error.error.message ?? "Something went wrong",
                    })
                },
            })
        })
    }
    return (
        <Form {...form}>
            <form className={cn("flex flex-col gap-6", className)} onSubmit={form.handleSubmit(onSubmit)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Reset your password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your new password below to reset your password.
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} id="password" type="password" placeholder="********" required />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password confirmation</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} id="passwordConfirmation" type="password" placeholder="********" required />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.passwordConfirmation?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isPending || form.formState.isSubmitting} type="submit" className="w-full">
                        Reset password
                    </Button>
                </div>
            </form>
        </Form>
    )
}
