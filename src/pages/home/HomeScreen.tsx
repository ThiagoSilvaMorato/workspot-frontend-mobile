import { Text, View } from 'react-native';
import { Button, ScreenContainer } from '@/components';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1 items-center justify-center gap-6">
        <Text className="text-3xl font-bold text-sage-700">Hello World</Text>
        {user ? (
          <Text className="text-base text-gray-500">
            Olá, <Text className="font-medium text-sage-600">{user.name}</Text> 👋
          </Text>
        ) : null}
        <Button label="Sair" variant="outline" onPress={logout} />
      </View>
    </ScreenContainer>
  );
}
