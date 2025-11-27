import { Resend } from "resend";
import { getUserByEmail } from "@/data/user";
import { VerifyEmail } from "../../emails/verify-email";
import { ResetPasswordConfirmation } from "../../emails/reset-password-confirmation";
import { SupportNotification } from "../../emails/support-notification";

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

export const sendSupportNotification = async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    type: "request" | "report";
}) => {
    try {
        await resend.emails.send({
            from: "Niato AI Support <support@ai.franckniat.site>",
            to: process.env.SUPPORT_EMAIL || "support@ai.franckniat.site",
            replyTo: data.email,
            subject: `[${data.type === "request" ? "Demande" : "Signalement"}] ${data.subject}`,
            react: SupportNotification({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                type: data.type,
            }) as React.ReactElement,
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending support notification:", error);
        return { error: "Erreur lors de l'envoi de la notification" };
    }
}
