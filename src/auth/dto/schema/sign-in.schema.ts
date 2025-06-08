import z from "zod";

export const signInDtoSchema = z.object({
	username: z.string(),
	password: z.string(),
});
