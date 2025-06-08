import z from "zod";
import { passwordSchema } from "./password.schema";

export const signUpDtoSchema = passwordSchema
    .extend({
        name: z.string().max(150, { message: "Max length exceeded" }),
        cpf: z.string().regex(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/g, { message: "CPF is invalid" }),
        phone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/g, { message: "Phone number is invalid" }),
        username: z
            .string()
            .min(6, { message: "Username must be at least 6 characters long" })
            .regex(/^[a-zA-Z\d]{6,}$/g, {
                message: "Username must contain only letters and numbers",
            }),
        email: z.string().email().max(150, { message: "Max length exceeded" }),
    })
    .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
        message: "Password and password confirmation must be the same",
    });