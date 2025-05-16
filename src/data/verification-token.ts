import {prisma} from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        return await prisma.verificationToken.findFirst({
            where: {
                email
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const getVerificationTokenByToken = async (token: string) => {
    try {
        return await prisma.verificationToken.findUnique({
            where: {
                token
            }
        })
    } catch (error) {
        console.log(error);
    }
}