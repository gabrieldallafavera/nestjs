import z from "zod";
import { signInDtoSchema } from "./schema/sign-in.schema";

export type SignInDto = z.infer<typeof signInDtoSchema>;