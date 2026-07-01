import { api } from '@/services/api';
import type {
  ApiResponse,
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth.types';

export const authApi = {
  login: (data: LoginRequest) => api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<User>>('/auth/register', data),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }),

  // O backend usa DELETE com Bearer auth obrigatório no header
  logout: (refreshToken: string) =>
    api.delete('/auth/logout', { data: { refreshToken } }),

  forgotPassword: (data: { email: string }) =>
    api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data),
};
