import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { twoFactor, emailOTP } from "better-auth/plugins"

const prisma = new PrismaClient();

export const auth = betterAuth({
    appName: "AI Chat",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    plugins: [
        twoFactor(), 
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                console.log(email, otp, type)
            }
        }), 
        nextCookies()
    ]
})

export const { signInEmail, signOut, signUpEmail, signInSocial } = auth.api