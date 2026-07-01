import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token é obrigatório'),
    newPassword: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .max(100, 'A senha deve ter no máximo 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
