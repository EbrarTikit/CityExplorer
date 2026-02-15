import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { Place } from '../types/place.types';
import { getCategoryById, getCategoryColor } from '../utils/categories';
import { useFavoritesStore } from '../store/favoritesStore';
import { usePlanStore } from '../../plan/store/planStore';

interface PlaceCardProps {
  place: Place;
  onPress: (place: Place) => void;
  cityLat?: number;
  cityLon?: number;
}

const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
};

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onPress,
  cityLat,
  cityLon,
}) => {
  const { colors } = useTheme();
  const category = getCategoryById(place.category);
  const categoryColor = getCategoryColor(place.category);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(place.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const addPlanItem = usePlanStore((s) => s.addItem);

  const distance =
    cityLat && cityLon
      ? getDistanceKm(cityLat, cityLon, place.lat, place.lon)
      : null;

  const handleAddToPlan = useCallback(() => {
    addPlanItem({
      placeId: place.id,
      placeName: place.name,
      lat: place.lat,
      lon: place.lon,
      category: place.category,
      day: 1,
    });
  }, [place, addPlanItem]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(place)}
      activeOpacity={0.7}
    >
      {/* Category color bar */}
      <View style={[styles.colorBar, { backgroundColor: categoryColor }]} />

      <View style={styles.content}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.nameContainer}>
            <Text
              style={[typography.bodyMedium, { color: colors.text.primary }]}
              numberOfLines={2}
            >
              {place.name}
            </Text>
            <View style={styles.metaRow}>
              {category && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: categoryColor + '20' },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={12}
                    color={categoryColor}
                  />
                  <Text
                    style={[
                      typography.small,
                      { color: categoryColor, marginLeft: 3 },
                    ]}
                  >
                    {category.title}
                  </Text>
                </View>
              )}
              {distance && (
                <Text style={[typography.small, { color: colors.text.tertiary, marginLeft: spacing.sm }]}>
                  {distance}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Description snippet */}
        {place.description && (
          <Text
            style={[typography.caption, { color: colors.text.secondary, marginTop: spacing.xs }]}
            numberOfLines={2}
          >
            {place.description}
          </Text>
        )}

        {/* Opening hours */}
        {place.openingHours && (
          <View style={[styles.infoRow, { marginTop: spacing.xs }]}>
            <Ionicons name="time-outline" size={12} color={colors.text.tertiary} />
            <Text
              style={[typography.small, { color: colors.text.tertiary, marginLeft: 4, flex: 1 }]}
              numberOfLines={1}
            >
              {place.openingHours}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => toggleFavorite(place)}
            style={styles.actionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.error : colors.text.tertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddToPlan}
            style={[
              styles.addPlanBtn,
              { backgroundColor: colors.primary + '15' },
            ]}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
            <Text
              style={[
                typography.small,
                { color: colors.primary, fontWeight: '600', marginLeft: 2 },
              ]}
            >
              Plana Ekle
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  actionBtn: {
    padding: spacing.xs,
  },
  addPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
});
