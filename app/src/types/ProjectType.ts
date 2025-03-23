import { z } from "zod";
import { projectSchema } from "../schemas";

export type ProjectType = z.infer<typeof projectSchema>;
