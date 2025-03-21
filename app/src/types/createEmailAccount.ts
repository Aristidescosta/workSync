import { z } from "zod";
import { createEmailAccountSchema } from "@schemas/createEmailAccount";

export type CreatAccountSchemaType = z.infer<typeof createEmailAccountSchema>;
