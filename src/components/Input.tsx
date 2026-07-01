import { forwardRef, useState } from 'react';
import {
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, secureTextEntry, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

    const borderColor = error
      ? 'border-red-400'
      : isFocused
        ? 'border-sage-500'
        : 'border-gray-300';

    return (
      <View className="gap-1">
        {label ? (
          <Text className="text-sm font-medium text-gray-700">{label}</Text>
        ) : null}

        <View className={`flex-row items-center rounded-xl border bg-gray-50 ${borderColor}`}>
          <TextInput
            ref={ref}
            {...rest}
            secureTextEntry={isSecure}
            onFocus={(e) => {
              setIsFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              rest.onBlur?.(e);
            }}
            className="flex-1 px-4 py-3 text-base text-gray-900"
            placeholderTextColor={colors.gray[400]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {secureTextEntry ? (
            <TouchableOpacity
              onPress={() => setIsSecure((prev) => !prev)}
              className="px-4 py-3"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-sm text-sage-600">{isSecure ? 'Mostrar' : 'Ocultar'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
      </View>
    );
  },
);

Input.displayName = 'Input';
