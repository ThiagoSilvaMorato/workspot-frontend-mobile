import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, FormField, ScreenContainer } from '@/components';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/forgot-password.schema';
import type { AuthStackParamList } from '@/navigation/AuthNavigator';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => setSubmitted(true),
      onError: (error) => {
        const message = isAxiosError(error)
          ? 'Não foi possível enviar o email. Verifique sua conexão.'
          : 'Ocorreu um erro inesperado. Tente novamente.';
        Alert.alert('Erro', message);
      },
    });
  };

  return (
    <ScreenContainer>
      <View className="flex-1 justify-center py-8">
        <TouchableOpacity className="mb-8 self-start" onPress={() => navigation.goBack()}>
          <Text className="text-sm text-sage-600">← Voltar</Text>
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-3xl font-bold text-sage-700">Recuperar senha</Text>
          <Text className="mt-2 text-base text-gray-500">
            Informe seu email para receber o link de recuperação
          </Text>
        </View>

        {submitted ? (
          <View className="gap-6">
            <View className="rounded-lg bg-sage-50 p-4">
              <Text className="text-base text-sage-700">
                Se o email existir, você receberá um link para redefinir sua senha em instantes.
              </Text>
            </View>
            <Button
              label="Voltar ao login"
              variant="outline"
              onPress={() => navigation.goBack()}
            />
          </View>
        ) : (
          <View className="gap-4">
            <FormField
              control={control}
              name="email"
              label="Email"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <View className="mt-2">
              <Button
                label="Enviar link"
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
                size="lg"
              />
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
