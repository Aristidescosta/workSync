import { z } from "zod";

export const projectSchema = z.object({
    title: z.string().min(1, { message: "O título é obrigatório" }),
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data de início deve ser no formato YYYY-MM-DD" }),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "A data de conclusão deve ser no formato YYYY-MM-DD" }),
    members: z.array(z.string()),
    id: z.string().uuid()
});