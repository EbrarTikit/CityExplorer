import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { Place } from '../../places/types/place.types';
import { getCategoryById, getCategoryColor } from '../../places/utils/categories';
import { useFavoritesStore } from '../../places/store/favoritesStore';

interface PlaceBottomSheetProps {
  place: Place;
  onClose: () => void;
  onViewDetail: (place: Place) => void;
}

export const PlaceBottomSheet: React.FC<PlaceBottomSheetProps> = ({
  place,
  onClose,
  onViewDetail,
}) => {
  const { colors } = useTheme();
  const category = getCategoryById(place.category);
  const catColor = getCategoryColor(place.category);
  const isFav = useFavoritesStore((s) => s.isFavorite(place.id));
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);

  const handleDirections = () => {
    Linking.openURL(
      `https://www.openstreetmap.org/directions?from=&to=${place.lat},${place.lon}`
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Handle */}
      <View style={[styles.handle, { backgroundColor: colors.border }]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text
            style={[typography.h3, { color: colors.text.primary }]}
            numberOfLines={2}
          >
            {place.name}
          </Text>
          {category && (
            <View
              style={[styles.badge, { backgroundColor: catColor + '20' }]}
            >
              <Ionicons name={category.icon as any} size={12} color={catColor} />
              <Text
                style={[typography.small, { color: catColor, marginLeft: 3 }]}
              >
                {category.title}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      {place.description && (
        <Text
          style={[
            typography.caption,
            { color: colors.text.secondary, marginTop: spacing.sm },
          ]}
          numberOfLines={2}
        >
          {place.description}
        </Text>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary + '15' }]}
          onPress={() => onViewDetail(place)}
        >
          <Ionicons name="information-circle" size={18} color={colors.primary} />
          <Text style={[typography.captionMedium, { color: colors.primary, marginLeft: 4 }]}>
            Detay
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.info + '15' }]}
          onPress={handleDirections}
        >
          <Ionicons name="navigate" size={18} color={colors.info} />
          <Text style={[typography.captionMedium, { color: colors.info, marginLeft: 4 }]}>
            Yol Tarifi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: isFav ? colors.error + '15' : colors.surfaceVariant },
          ]}
          onPress={() => toggleFav(place)}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={18}
            color={isFav ? colors.error : colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  closeBtn: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
});
