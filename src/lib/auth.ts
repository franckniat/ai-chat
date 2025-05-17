import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor, openAPI } from "better-auth/plugins"
import prisma from "@/lib/db";
import { sendVerificationEMail } from "./mail";


export const auth = betterAuth({
    appName: "AI Chat",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
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