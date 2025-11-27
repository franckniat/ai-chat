"use server";

import { actionClient } from "@/lib/safe-action";
import { supportSchema } from "@/schemas/support";
import { sendSupportNotification } from "@/lib/mail";

export const submitSupportRequest = actionClient
    .schema(supportSchema as any)
    .action(async ({ parsedInput }) => {
        try {
            const result = await sendSupportNotification({
                name: parsedInput.name,
                email: parsedInput.email,
                subject: parsedInput.subject,
                message: parsedInput.message,
                type: parsedInput.type,
            });

            if (result.error) {
                return {
                    success: false,
                    message: result.error,
                };
            }

            return {
                success: true,
                message: "Votre demande a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.",
            };
        } catch (error) {
            console.error("Support request error:", error);
            return {
                success: false,
                message: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
            };
        }
    });
