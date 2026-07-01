import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Digite um email válido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
