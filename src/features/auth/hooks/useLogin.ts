import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginFormData } from '../schemas/login.schema';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      authApi.login(data).then((res) => res.data.data),
    onSuccess: (data) => login(data),
  });
}
