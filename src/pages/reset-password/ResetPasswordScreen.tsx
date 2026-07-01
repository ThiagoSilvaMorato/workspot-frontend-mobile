import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Button, FormField, ScreenContainer } from '@/components';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/features/auth/schemas/reset-password.schema';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = RouteProp<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const routeToken = route.params?.token ?? '';

  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: routeToken, newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(
      { token: data.token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          Alert.alert('Senha atualizada com sucesso', 'Faça login com sua nova senha.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]);
        },
        onError: (error) => {
          const message =
            isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : 'Não foi possível redefinir a senha. Tente novamente.';
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
          <Text className="text-3xl font-bold text-sage-700">Nova senha</Text>
          <Text className="mt-2 text-base text-gray-500">
            Insira o token recebido por email e defina sua nova senha
          </Text>
        </View>

        <View className="gap-4">
          <FormField
            control={control}
            name="token"
            label="Token"
            placeholder="Cole o token do email"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormField
            control={control}
            name="newPassword"
            label="Nova senha"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
          />

          <FormField
            control={control}
            name="confirmPassword"
            label="Confirmar senha"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
          />

          <View className="mt-2">
            <Button
              label="Redefinir senha"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              size="lg"
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
