import { Resend } from "resend";
import { getUserByEmail } from "@/data/user";
import { VerifyEmail } from "../../emails/verify-email";
import { ResetPasswordConfirmation } from "../../emails/reset-password-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEMail = async (email: string, url: string) => {
    const user = await getUserByEmail(email)
    if (!user) return {
        error: "Utilisateur non trouvé !"
    };
    await resend.emails.send({
        from: "Niato AI <donot-reply@ai.franckniat.site>",
        to: email,
        subject: "Vérification de votre adresse email",
        react: VerifyEmail({
            name: user?.name,
            email,
            verifyUrl: url,
        }) as React.ReactElement,
    })
}

export const sendResetPasswordEMail = async (email: string, url: string) => {
    const user = await getUserByEmail(email)
    if (!user) return {
        error: "Utilisateur non trouvé !"
    };
    await resend.emails.send({
        from: "Niato AI <donot-reply@ai.franckniat.site>",
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        react: ResetPasswordConfirmation({
            name: user?.name,
            email,
            resetUrl: url,
        }) as React.ReactElement,
    })
}
