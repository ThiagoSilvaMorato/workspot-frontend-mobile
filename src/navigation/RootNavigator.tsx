import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Loading } from '@/components';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const { isAuthenticated, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return <Loading />;
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
