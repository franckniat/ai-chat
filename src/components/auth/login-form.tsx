"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/schemas/user"
import { LoginSchema } from "@/schemas/user"
import { Form, FormMessage, FormDescription, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useRouter, useSearchParams } from "next/navigation";
import { signInGoogle } from "@/actions/auth";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const params = useSearchParams();
    const loginform = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const onSubmit = async (data: LoginSchema) => {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
            }, {
                onRequest: () => {
                    toast.info("Please wait ...")
                },
                onSuccess: async () => {
                    toast.success("Logged in", {
                        description: "You have been logged in.",
                    })
                    toast.info("Please wait ...")
                    const callbackUrl = params.get("callbackUrl") || "/chat";
                    router.push(callbackUrl);
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
        <Form {...loginform}>
            <form className={cn("flex flex-col gap-6", className)} onSubmit={loginform.handleSubmit(onSubmit)} {...props}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email below to login to your account.
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FormField
                            control={loginform.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} id="email" type="email" placeholder="m@example.com" required />
                                    </FormControl>
                                    <FormMessage>{loginform.formState.errors.email?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormField
                            control={loginform.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} id="password" type="password" placeholder="Your password" required />
                                    </FormControl>
                                    <FormMessage>{loginform.formState.errors.password?.message}</FormMessage>
                                    <FormDescription className="flex items-center justify-end">
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isPending || loginform.formState.isSubmitting} type="submit" className="w-full">
                        Login
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                    <Button variant="outline" className="w-full" type="button" disabled={isPending || loginform.formState.isSubmitting}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                fill="currentColor"
                            />
                        </svg>
                        Login with Github
                    </Button>
                    <Button variant="outline" className="w-full" type="button" disabled={isPending || loginform.formState.isSubmitting} onClick={() => signInGoogle()}>
                        <svg width="800px" height="800px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg>
                        Login with Google
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </form>
        </Form>
    )
}
