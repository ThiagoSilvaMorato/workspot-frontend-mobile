import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { ForgotPasswordFormData } from '../schemas/forgot-password.schema';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      authApi.forgotPassword(data).then((res) => res.data.data),
  });
}
