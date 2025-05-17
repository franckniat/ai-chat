import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor, openAPI } from "better-auth/plugins"
import { sendVerificationEMail, sendResetPasswordEMail } from "./mail";
import prisma from "@/lib/db";



export const auth = betterAuth({
    appName: "niato ai",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendResetPasswordEMail(user.email as string, url);
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
        },
    },
    emailVerification: {
        sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600,
        sendVerificationEmail: async ({ user, token }) => {
            const verificationUrl = `${process.env.BETTER_AUTH_URL}/email-verified?token=${token}`;
            await sendVerificationEMail(user.email as string, verificationUrl);
        },
    },
    plugins: [
        twoFactor(),
        nextCookies(),
        openAPI()
    ]
})

export type Session = typeof auth.$Infer.Session;

export const { signInEmail, signOut, signUpEmail, signInSocial } = auth.api