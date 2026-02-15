import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

interface DayTabsProps {
  totalDays: number;
  selectedDay: number;
  onSelect: (day: number) => void;
  itemCounts: Record<number, number>;
}

export const DayTabs: React.FC<DayTabsProps> = ({
  totalDays,
  selectedDay,
  onSelect,
  itemCounts,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
        const isSelected = day === selectedDay;
        const count = itemCounts[day] || 0;
        return (
          <TouchableOpacity
            key={day}
            style={[
              styles.tab,
              {
                backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(day)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                typography.captionMedium,
                { color: isSelected ? '#ffffff' : colors.text.primary },
              ]}
            >
              Gün {day}
            </Text>
            {count > 0 && (
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(255,255,255,0.3)'
                      : colors.primary + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    typography.small,
                    {
                      color: isSelected ? '#ffffff' : colors.primary,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
