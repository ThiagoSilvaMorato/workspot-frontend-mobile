import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {scrollable ? (
          <ScrollView
            className={`flex-1 px-6 ${className}`}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <SafeAreaView className={`flex-1 px-6 ${className}`}>{children}</SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
