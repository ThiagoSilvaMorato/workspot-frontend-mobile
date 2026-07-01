import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/pages/login/LoginScreen';
import { ForgotPasswordScreen } from '@/pages/forgot-password/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/pages/reset-password/ResetPasswordScreen';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
