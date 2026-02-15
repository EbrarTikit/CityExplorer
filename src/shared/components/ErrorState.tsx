import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Bir hata oluştu',
  message = 'Lütfen tekrar deneyin.',
  onRetry,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={56} color={colors.error} />
      <Text
        style={[typography.h3, { color: colors.text.primary, marginTop: spacing.lg }]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.body,
          {
            color: colors.text.secondary,
            marginTop: spacing.sm,
            textAlign: 'center',
          },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Tekrar Dene"
          onPress={onRetry}
          variant="outline"
          size="sm"
          style={{ marginTop: spacing.xl }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
  },
});
