import * as SecureStore from 'expo-secure-store';
import type { User } from '@/features/auth/types/auth.types';

const KEYS = {
  ACCESS_TOKEN: 'workspot_access_token',
  REFRESH_TOKEN: 'workspot_refresh_token',
  USER: 'workspot_user',
} as const;

export const storage = {
  saveTokens: (accessToken: string, refreshToken: string): Promise<void[]> =>
    Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken),
    ]),

  getAccessToken: (): Promise<string | null> =>
    SecureStore.getItemAsync(KEYS.ACCESS_TOKEN),

  getRefreshToken: (): Promise<string | null> =>
    SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),

  saveUser: (user: User): Promise<void> =>
    SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user)),

  getUser: async (): Promise<User | null> => {
    const raw = await SecureStore.getItemAsync(KEYS.USER);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  clearAll: (): Promise<void[]> =>
    Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER),
    ]),
};
