import { z } from 'zod/v3';

//Auth schemas

export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email(),
    password: z.string().refine(
        (value) => value.length >= 8,
        "Password must be at least 8 characters long"
    ).refine((value) => {
        const hasNumber = /\d/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        return hasNumber && hasUppercase && hasSpecialChar;
    }, "Password must contain at least one number, one uppercase letter, and one special character"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    password: z.string().refine(
        (value) => value.length >= 8,
        "Password must be at least 8 characters long"
    ).refine((value) => {
        const hasNumber = /\d/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        return hasNumber && hasUppercase && hasSpecialChar;
    }, "Password must contain at least one number, one uppercase letter, and one special character"),
    passwordConfirmation: z.string(),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
