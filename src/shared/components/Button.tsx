import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const { colors } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.lg,
      gap: spacing.sm,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
      md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
      lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.surfaceVariant },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
      },
      ghost: { backgroundColor: 'transparent' },
    };

    return {
      ...base,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled || loading ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: '#ffffff' },
      secondary: { color: colors.text.primary },
      outline: { color: colors.primary },
      ghost: { color: colors.primary },
    };

    return {
      ...typography.button,
      ...variantTextStyles[variant],
      fontSize: size === 'sm' ? 13 : size === 'lg' ? 17 : 15,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#ffffff' : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
