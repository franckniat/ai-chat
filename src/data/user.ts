"use server";

import prisma from "@/lib/db";

export const getUserById = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
};

export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};

export const getAllUsers = async () => {
    return await prisma.user.findMany();
};