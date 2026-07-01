import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, FormField, ScreenContainer } from '@/components';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/login.schema';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { mutate: login, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error) => {
        const message =
          isAxiosError(error) && error.response?.status === 401
            ? 'Email ou senha incorretos. Tente novamente.'
            : 'Não foi possível fazer login. Verifique sua conexão.';
        Alert.alert('Erro ao entrar', message);
      },
    });
  };

  return (
    <ScreenContainer>
      <View className="flex-1 justify-center py-8">
        {/* Header */}
        <View className="mb-10">
          <Text className="text-4xl font-bold text-sage-700">WorkSpot</Text>
          <Text className="mt-2 text-base text-gray-500">
            Encontre seu espaço ideal para trabalhar
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <FormField
            control={control}
            name="email"
            label="Email"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="email-input"
          />

          <FormField
            control={control}
            name="password"
            label="Senha"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
            testID="password-input"
          />

          <View className="mt-2">
            <Button
              label="Entrar"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              size="lg"
              testID="submit-button"
            />
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center gap-3">
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text className="text-sm text-sage-600">Esqueci minha senha</Text>
          </TouchableOpacity>
          <Text className="text-sm text-gray-400">
            Espaços confortáveis para você trabalhar com calma.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
