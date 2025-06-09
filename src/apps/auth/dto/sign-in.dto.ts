import type z from "zod";
import type { signInDtoSchema } from "./schema/sign-in.schema";

export type SignInDto = z.infer<typeof signInDtoSchema>;
