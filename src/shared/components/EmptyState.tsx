import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search-outline',
  title,
  message,
  action,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.text.tertiary} />
      <Text
        style={[
          typography.h3,
          { color: colors.text.primary, marginTop: spacing.lg, textAlign: 'center' },
        ]}
      >
        {title}
      </Text>
      {message && (
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
      )}
      {action && <View style={{ marginTop: spacing.xl }}>{action}</View>}
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
