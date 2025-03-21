import { z } from "zod";
import { AuthenticationSchema } from "@schemas/authentication";

export type LoginSchemaType = z.infer<typeof AuthenticationSchema>;
