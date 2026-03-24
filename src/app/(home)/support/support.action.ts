"use server";
// Action cote serveur

import { actionClient } from "@/lib/safe-action";
import { supportSchema } from "@/schemas/support";
import { sendSupportNotification } from "@/lib/mail";

export const submitSupportRequest = actionClient
    .schema(supportSchema)
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
                message: "Your request has been sent successfully. We will get back to you as soon as possible.",
            };
        } catch (error) {
            console.error("Support request error:", error);
            return {
                success: false,
                message: "An error occurred while sending your request. Please try again.",
            };
        }
    });
