import {Resend} from "resend";
import { EmailTemplate } from '@/components/email-template';
import { getUserByEmail } from "@/data/user";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEMail = async (email:string, url:string)=>{
    const user = await getUserByEmail(email)
    if(!user) return {
        error: "Utilisateur non trouvé !"
    };
    await resend.emails.send({
        from: "Niato AI <info@ai.franckniat.site>",
        to: email,
        subject: "Vérification de votre adresse email",
        react: EmailTemplate({
            firstName: user?.name as string,
            email: email,
            customLink: url
        }) as React.ReactElement,
    })
}