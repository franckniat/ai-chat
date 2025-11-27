import { z } from "zod";

export const supportSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
    message: z.string().min(20, "Le message doit contenir au moins 20 caractères"),
    type: z.enum(["request", "report"], {
        message: "Veuillez sélectionner un type de demande",
    }),
});

export type SupportFormData = z.infer<typeof supportSchema>;
