import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { RootStackParamList } from '../../../app/navigation/types';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useFavoritesStore } from '../store/favoritesStore';
import { getCategoryColor, getCategoryById } from '../utils/categories';
import { Place } from '../types/place.types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const FavoritesScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const favorites = useFavoritesStore((s) => s.favorites);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  const handlePress = useCallback(
    (fav: (typeof favorites)[0]) => {
      // Build a minimal Place object for navigation
      const place: Place = {
        id: fav.id,
        osmId: fav.osmId,
        osmType: fav.osmType as Place['osmType'],
        name: fav.name,
        lat: fav.lat,
        lon: fav.lon,
        category: fav.category,
        tags: {},
      };
      navigation.navigate('PlaceDetail', { place });
    },
    [navigation]
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.headerBar}>
          <Text style={[typography.h2, { color: colors.text.primary }]}>Favoriler</Text>
        </View>
        <EmptyState
          icon="heart-outline"
          title="Henüz favori yok"
          message="Beğendiğiniz yerleri favorilere ekleyin."
        />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: (typeof favorites)[0] }) => {
    const category = getCategoryById(item.category);
    const catColor = getCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.colorDot, { backgroundColor: catColor }]} />
        <View style={styles.cardContent}>
          <Text
            style={[typography.bodyMedium, { color: colors.text.primary }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {category?.title || item.category}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => removeFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="heart" size={22} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.headerBar}>
        <Text style={[typography.h2, { color: colors.text.primary }]}>Favoriler</Text>
        <Text style={[typography.caption, { color: colors.text.tertiary }]}>
          {favorites.length} yer
        </Text>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
