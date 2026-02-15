import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { CATEGORIES, PlaceCategory } from '../utils/categories';

interface CategoryChipsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedId,
  onSelect,
}) => {
  const { colors } = useTheme();

  const renderChip = (category: PlaceCategory) => {
    const isSelected = category.id === selectedId;
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.chip,
          {
            backgroundColor: isSelected ? category.color : colors.surfaceVariant,
            borderColor: isSelected ? category.color : colors.border,
          },
        ]}
        onPress={() => onSelect(category.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={category.icon as any}
          size={12}
          color={isSelected ? '#ffffff' : category.color}
        />
        <Text
          style={[
            typography.small,
            {
              color: isSelected ? '#ffffff' : colors.text.primary,
              marginLeft: 3,
              fontSize: 10,
              fontWeight: '500',
            },
          ]}
          numberOfLines={1}
        >
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map(renderChip)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
});
