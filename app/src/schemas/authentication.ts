import { z } from "zod";

export const AuthenticationSchema = z.object({
    email: z.string()
        .email({ message: "Email inválido" })
        .refine(val => val !== '', { message: "Este campo é obrigatório" }),
    
    password: z.string()
        .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
        .max(100, { message: "A senha pode ter no máximo 100 caracteres" })
        .refine(val => val !== '', { message: "Este campo é obrigatório" }),
});
