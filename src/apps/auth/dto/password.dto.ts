import type z from "zod";
import type { passwordDtoSchema } from "./schema/password.schema";

export type PasswordDto = z.infer<typeof passwordDtoSchema>;
