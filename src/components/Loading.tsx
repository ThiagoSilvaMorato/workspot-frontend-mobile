import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme';

export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color={colors.sage[500]} />
    </View>
  );
}
