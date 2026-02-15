import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, containerStyle, style, ...props }, ref) => {
    const { colors } = useTheme();

    return (
      <View style={containerStyle}>
        {label && (
          <Text
            style={[
              typography.captionMedium,
              { color: colors.text.secondary, marginBottom: spacing.xs },
            ]}
          >
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: error ? colors.error : colors.border,
            },
          ]}
        >
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              typography.body,
              { color: colors.text.primary },
              style,
            ]}
            placeholderTextColor={colors.text.tertiary}
            {...props}
          />
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </View>
        {error && (
          <Text
            style={[
              typography.small,
              { color: colors.error, marginTop: spacing.xs },
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  icon: {
    marginHorizontal: spacing.xs,
  },
});
