"use server";

import { signIn } from "@/lib/auth-client";
import { LoginSchema } from "@/schemas/user";
import { redirect } from "next/navigation";

export const signInGoogle = async () => {
    const { data } = await signIn.social({
        provider: "google",
    });
    if(data?.url && data.redirect) {
        redirect(data.url)
    }
}

export const signInEmail = async (data:LoginSchema) => {
    const { data: session } = await signIn.email({
        email: data.email,
        password: data.password,
    });
    return session
}

export const signUpEmail = async (data:LoginSchema) => {
    const { data: session } = await signIn.email({
        email: data.email,
        password: data.password,
    });
    console.log(session)
}

