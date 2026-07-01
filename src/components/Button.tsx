import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';
import { colors } from '@/theme';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-sage-500 active:bg-sage-600',
    text: 'text-white font-semibold',
  },
  outline: {
    container: 'border border-sage-500 bg-transparent active:bg-sage-50',
    text: 'text-sage-600 font-semibold',
  },
  ghost: {
    container: 'bg-transparent active:bg-gray-100',
    text: 'text-sage-600 font-medium',
  },
};

const sizeClasses: Record<Size, { container: string; text: string }> = {
  sm: { container: 'py-2 px-4 rounded-lg', text: 'text-sm' },
  md: { container: 'py-3 px-6 rounded-xl', text: 'text-base' },
  lg: { container: 'py-4 px-8 rounded-xl', text: 'text-lg' },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${variantClasses[variant].container} ${sizeClasses[size].container} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? colors.white : colors.sage[500]} />
      ) : (
        <Text className={`${variantClasses[variant].text} ${sizeClasses[size].text}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
