import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config/env';
import { storage } from '@/services/storage';
import type { ApiResponse, AuthTokens } from '@/features/auth/types/auth.types';

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.requestTimeout,
  headers: { 'Content-Type': 'application/json' },
});

// Fila de requests que falharam com 401 enquanto o refresh estava em andamento
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

// Rotas que não devem disparar o refresh em caso de 401
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh'];

const isAuthRoute = (url: string | undefined): boolean =>
  AUTH_ROUTES.some((route) => url?.includes(route));

api.interceptors.request.use((requestConfig) => {
  console.log({apiurl: config.apiUrl})
  const { useAuthStore } = require('@/features/auth/store/auth.store');
  const token = useAuthStore.getState().accessToken as string | null;
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry || isAuthRoute(original.url)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await storage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const { data } = await api.post<ApiResponse<AuthTokens>>('/auth/refresh', {
        refreshToken,
      });

      const { accessToken: newAccess, refreshToken: newRefresh } = data.data;

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useAuthStore } = require('@/features/auth/store/auth.store');
      useAuthStore.getState().setTokens({ accessToken: newAccess, refreshToken: newRefresh });
      await storage.saveTokens(newAccess, newRefresh);

      processQueue(null, newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useAuthStore } = require('@/features/auth/store/auth.store');
      await useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
