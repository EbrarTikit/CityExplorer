import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { City } from '../types/city.types';

interface CitySuggestionItemProps {
  city: City;
  onPress: (city: City) => void;
  isRecent?: boolean;
}

export const CitySuggestionItem: React.FC<CitySuggestionItemProps> = ({
  city,
  onPress,
  isRecent = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => onPress(city)}
      activeOpacity={0.6}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isRecent ? colors.warning + '20' : colors.primary + '15' },
        ]}
      >
        <Ionicons
          name={isRecent ? 'time-outline' : 'location'}
          size={20}
          color={isRecent ? colors.warning : colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[typography.bodyMedium, { color: colors.text.primary }]}
          numberOfLines={1}
        >
          {city.name}
        </Text>
        <Text
          style={[typography.caption, { color: colors.text.secondary }]}
          numberOfLines={1}
        >
          {city.country}
          {city.countryCode ? ` (${city.countryCode.toUpperCase()})` : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
