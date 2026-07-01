import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      authApi.resetPassword(data).then((res) => res.data.data),
  });
}
