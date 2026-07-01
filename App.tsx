import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from '@/navigation/RootNavigator';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

const linking: LinkingOptions<AuthStackParamList> = {
  prefixes: ['workspot://'],
  config: {
    screens: {
      ResetPassword: 'recuperar-senha',
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer linking={linking}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
