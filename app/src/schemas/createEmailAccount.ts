import { z } from "zod";

export const createEmailAccountSchema = z.object({
    fullName: z.string()
        .min(1, { message: "Este campo é obrigatório" })
        .max(100, { message: "O nome completo não pode exceder 100 caracteres" }),

    email: z.string()
        .email({ message: "Email inválido" }),

        phone: z.string().regex(/^\+244\d{9}$/, { message: "Número de telefone inválido. Deve ser no formato +244 seguido de nove dígitos." })
        .endsWith("+244"),

    password: z.string()
        .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
        .max(100, { message: "A senha pode ter no máximo 100 caracteres" }),

    confirmPassword: z.string()
        .min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres" })
        .max(100, { message: "A confirmação de senha pode ter no máximo 100 caracteres" })
});
