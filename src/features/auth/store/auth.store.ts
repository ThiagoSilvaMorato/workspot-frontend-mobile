import { create } from 'zustand';
import { storage } from '@/services/storage';
import type { User, AuthResponse, AuthTokens } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (response: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (tokens: AuthTokens) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  login: async (response) => {
    await storage.saveTokens(response.accessToken, response.refreshToken);
    await storage.saveUser(response.user);
    set({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await storage.clearAll();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setTokens: ({ accessToken, refreshToken }) =>
    set({ accessToken, refreshToken }),

  hydrate: async () => {
    const [accessToken, refreshToken, user] = await Promise.all([
      storage.getAccessToken(),
      storage.getRefreshToken(),
      storage.getUser(),
    ]);
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: !!(accessToken && user),
      isHydrated: true,
    });
  },
}));
