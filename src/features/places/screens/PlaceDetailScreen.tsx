import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { RootStackParamList } from '../../../app/navigation/types';
import { getCategoryById, getCategoryColor } from '../utils/categories';
import { useFavoritesStore } from '../store/favoritesStore';
import { usePlanStore } from '../../plan/store/planStore';
import { Button } from '../../../shared/components/Button';

type RoutePropType = RouteProp<RootStackParamList, 'PlaceDetail'>;

export const PlaceDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<RoutePropType>();
  const { place } = route.params;

  const isFavorite = useFavoritesStore((s) => s.isFavorite(place.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const addPlanItem = usePlanStore((s) => s.addItem);

  const category = getCategoryById(place.category);
  const categoryColor = getCategoryColor(place.category);

  const handleOpenWebsite = useCallback(() => {
    if (place.website) {
      Linking.openURL(
        place.website.startsWith('http')
          ? place.website
          : `https://${place.website}`
      );
    }
  }, [place.website]);

  const handleOpenWikipedia = useCallback(() => {
    if (place.wikipedia) {
      const [lang, title] = place.wikipedia.split(':');
      if (lang && title) {
        Linking.openURL(
          `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`
        );
      }
    }
  }, [place.wikipedia]);

  const handleCall = useCallback(() => {
    if (place.phone) {
      Linking.openURL(`tel:${place.phone}`);
    }
  }, [place.phone]);

  const handleAddToPlan = useCallback(() => {
    addPlanItem({
      placeId: place.id,
      placeName: place.name,
      lat: place.lat,
      lon: place.lon,
      category: place.category,
      day: 1,
    });
    Alert.alert('Eklendi', `"${place.name}" 1. gün planına eklendi.`);
  }, [place, addPlanItem]);

  const handleOpenMap = useCallback(() => {
    const url = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`;
    Linking.openURL(url);
  }, [place.lat, place.lon]);

  const InfoRow: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress?: () => void;
    color?: string;
  }> = ({ icon, text, onPress, color }) => (
    <TouchableOpacity
      style={[styles.infoRow, { borderColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <Ionicons name={icon} size={20} color={color || colors.primary} />
      <Text
        style={[
          typography.body,
          {
            color: onPress ? colors.primary : colors.text.primary,
            marginLeft: spacing.md,
            flex: 1,
          },
        ]}
        numberOfLines={2}
      >
        {text}
      </Text>
      {onPress && (
        <Ionicons name="open-outline" size={16} color={colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header card */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
        <View style={styles.headerContent}>
          <Text style={[typography.h2, { color: colors.text.primary }]}>
            {place.name}
          </Text>

          <View style={styles.categoryRow}>
            {category && (
              <View
                style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}
              >
                <Ionicons name={category.icon as any} size={14} color={categoryColor} />
                <Text
                  style={[typography.captionMedium, { color: categoryColor, marginLeft: 4 }]}
                >
                  {category.title}
                </Text>
              </View>
            )}
            <Text style={[typography.caption, { color: colors.text.tertiary }]}>
              {place.osmType} #{place.osmId}
            </Text>
          </View>

          {/* Favorite button */}
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleFavorite(place)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.error : colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      {place.description && (
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[typography.captionMedium, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
            Açıklama
          </Text>
          <Text style={[typography.body, { color: colors.text.primary }]}>
            {place.description}
          </Text>
        </View>
      )}

      {/* Info section */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[typography.captionMedium, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
          Bilgiler
        </Text>

        {place.openingHours && (
          <InfoRow icon="time-outline" text={place.openingHours} />
        )}
        {place.phone && (
          <InfoRow icon="call-outline" text={place.phone} onPress={handleCall} />
        )}
        {place.website && (
          <InfoRow
            icon="globe-outline"
            text={place.website}
            onPress={handleOpenWebsite}
          />
        )}
        {place.wikipedia && (
          <InfoRow
            icon="book-outline"
            text={`Wikipedia: ${place.wikipedia}`}
            onPress={handleOpenWikipedia}
          />
        )}

        <InfoRow
          icon="navigate-outline"
          text={`${place.lat.toFixed(5)}, ${place.lon.toFixed(5)}`}
          onPress={handleOpenMap}
        />
      </View>

      {/* Extra tags */}
      {place.tags && Object.keys(place.tags).length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[typography.captionMedium, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
            OSM Etiketleri
          </Text>
          {Object.entries(place.tags)
            .filter(
              ([key]) =>
                !['name', 'name:en', 'description', 'description:en'].includes(key)
            )
            .slice(0, 10)
            .map(([key, value]) => (
              <View key={key} style={styles.tagRow}>
                <Text
                  style={[typography.small, { color: colors.text.tertiary, width: 120 }]}
                  numberOfLines={1}
                >
                  {key}
                </Text>
                <Text
                  style={[typography.small, { color: colors.text.secondary, flex: 1 }]}
                  numberOfLines={1}
                >
                  {value}
                </Text>
              </View>
            ))}
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <Button
          title="Haritada Göster"
          onPress={handleOpenMap}
          variant="outline"
          icon={<Ionicons name="map-outline" size={18} color={colors.primary} />}
        />
        <View style={{ height: spacing.md }} />
        <Button
          title="Plana Ekle"
          onPress={handleAddToPlan}
          variant="primary"
          icon={<Ionicons name="add-circle-outline" size={18} color="#ffffff" />}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  headerCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  categoryIndicator: {
    width: 5,
  },
  headerContent: {
    flex: 1,
    padding: spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  favButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  section: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
  },
  tagRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
  },
});
