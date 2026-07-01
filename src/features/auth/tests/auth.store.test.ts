import { act } from '@testing-library/react-native';
import { useAuthStore } from '../store/auth.store';

const mockUser = {
  id: 'user-123',
  name: 'Teste',
  email: 'teste@example.com',
  role: 'USER' as const,
};

const mockTokens = {
  accessToken: 'access-token-abc',
  refreshToken: 'refresh-token-xyz',
};

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
  // Reset store state between tests
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isHydrated: false,
  });
  // Reset all mock implementations to defaults (clearAllMocks only resets call records)
  jest.resetAllMocks();
  const SecureStore = require('expo-secure-store');
  SecureStore.setItemAsync.mockResolvedValue(undefined);
  SecureStore.getItemAsync.mockResolvedValue(null);
  SecureStore.deleteItemAsync.mockResolvedValue(undefined);
});

describe('useAuthStore', () => {
  describe('login()', () => {
    it('seta user, tokens e isAuthenticated após login', async () => {
      await act(async () => {
        await useAuthStore.getState().login({ ...mockTokens, user: mockUser });
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockTokens.accessToken);
      expect(state.refreshToken).toBe(mockTokens.refreshToken);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logout()', () => {
    it('limpa user, tokens e isAuthenticated após logout', async () => {
      await act(async () => {
        await useAuthStore.getState().login({ ...mockTokens, user: mockUser });
      });

      await act(async () => {
        await useAuthStore.getState().logout();
      });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('hydrate()', () => {
    it('restaura sessão quando tokens e user existem no storage', async () => {
      const SecureStore = require('expo-secure-store');
      SecureStore.getItemAsync.mockImplementation((key: string) => {
        if (key === 'workspot_access_token') return Promise.resolve(mockTokens.accessToken);
        if (key === 'workspot_refresh_token') return Promise.resolve(mockTokens.refreshToken);
        if (key === 'workspot_user') return Promise.resolve(JSON.stringify(mockUser));
        return Promise.resolve(null);
      });

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isHydrated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('não autentica quando storage está vazio', async () => {
      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isHydrated).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('setTokens()', () => {
    it('atualiza tokens sem afetar user ou isAuthenticated', () => {
      useAuthStore.getState().setTokens({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('new-access');
      expect(state.refreshToken).toBe('new-refresh');
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
