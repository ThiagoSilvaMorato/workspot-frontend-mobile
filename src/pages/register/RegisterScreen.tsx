import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, FormField, ScreenContainer } from '@/components';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/register.schema';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { mutate: register, isPending } = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = ({ name, email, password }: RegisterFormData) => {
    register(
      { name, email, password },
      {
        onSuccess: () => {
          Alert.alert('Conta criada!', 'Faça login para continuar.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]);
        },
        onError: (error) => {
          const message =
            isAxiosError(error) && error.response?.status === 409
              ? 'Este email já está em uso.'
              : 'Não foi possível criar sua conta. Verifique sua conexão.';
          Alert.alert('Erro', message);
        },
      },
    );
  };

  return (
    <ScreenContainer>
      <View className="flex-1 justify-center py-8">
        <TouchableOpacity className="mb-8 self-start" onPress={() => navigation.goBack()}>
          <Text className="text-sm text-sage-600">← Voltar</Text>
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-3xl font-bold text-sage-700">Criar conta</Text>
          <Text className="mt-2 text-base text-gray-500">
            Preencha os dados abaixo para se registrar
          </Text>
        </View>

        <View className="gap-4">
          <FormField
            control={control}
            name="name"
            label="Nome"
            placeholder="Seu nome completo"
            autoCapitalize="words"
            autoComplete="name"
            testID="name-input"
          />

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
            autoComplete="new-password"
            testID="password-input"
          />

          <FormField
            control={control}
            name="confirmPassword"
            label="Confirmar senha"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
            testID="confirm-password-input"
          />

          <View className="mt-2">
            <Button
              label="Criar conta"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              size="lg"
              testID="submit-button"
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
