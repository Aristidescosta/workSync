import { z } from "zod";
import { projectSchema } from "../schemas";

export type ProjectSchemaType = z.infer<typeof projectSchema>;

export type ProjectType = ProjectSchemaType & {
    owner: {
        name: string,
        id: string
    }
};
