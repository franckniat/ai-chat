/**
 * Helpers d'acces a la table `users`.
 *
 * Ce fichier n'est volontairement PAS marque `"use server"` : sous cette
 * directive, chaque export devient une Server Action, donc un endpoint HTTP
 * public. `getUserByEmail` exposee ainsi permettait d'enumerer les comptes
 * (id, nom, email, role) sans aucune authentification.
 *
 * Ce sont des helpers internes, appeles depuis du code serveur uniquement.
 */
import prisma from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
};
