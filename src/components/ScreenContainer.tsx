import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
}

export function ScreenContainer({
  children,
  scrollable = true,
  className = '',
}: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {scrollable ? (
        <KeyboardAwareScrollView
          className={`flex-1 px-6 ${className}`}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={Platform.OS === 'android' ? 16 : 0}
          keyboardOpeningTime={0}
        >
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View className={`flex-1 px-6 ${className}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
