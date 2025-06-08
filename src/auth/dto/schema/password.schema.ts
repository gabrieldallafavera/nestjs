import z from "zod";

export const passwordSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/g, {
            message:
                "Password must have at least one lowercase character, one uppercase character, one number and one special character",
        }),
    passwordConfirmation: z.string(),
});