import { z } from "zod";
import { signUpDtoSchema } from "./schema/sign-up.schema";

export type SignUpDto = z.infer<typeof signUpDtoSchema>;