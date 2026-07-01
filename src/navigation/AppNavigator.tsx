import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/pages/home/HomeScreen';
import { colors } from '@/theme';

export type AppStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.sage[700],
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'WorkSpot' }} />
    </Stack.Navigator>
  );
}
