import type { z } from "zod";
import type { signUpDtoSchema } from "./schema/sign-up.schema";

export type SignUpDto = z.infer<typeof signUpDtoSchema>;
