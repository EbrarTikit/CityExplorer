import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { RootStackParamList } from '../../../app/navigation/types';
import { CategoryChips } from '../components/CategoryChips';
import { PlaceCard } from '../components/PlaceCard';
import { PlaceSkeletonList } from '../components/PlaceSkeleton';
import { ErrorState } from '../../../shared/components/ErrorState';
import { EmptyState } from '../../../shared/components/EmptyState';
import { usePlaces } from '../hooks/usePlaces';
import { useCurrentCity } from '../../city/hooks/useCurrentCity';
import { Place } from '../types/place.types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const ExploreScreen: React.FC = () => {
  const { colors, toggleTheme, isDark } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { currentCity, clearCity } = useCurrentCity();
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const { data: places, isLoading, isError, refetch, isRefetching } = usePlaces(selectedCategory);

  const handlePlacePress = useCallback(
    (place: Place) => {
      navigation.navigate('PlaceDetail', { place });
    },
    [navigation]
  );

  const handleChangeCity = useCallback(() => {
    clearCity();
    navigation.reset({ index: 0, routes: [{ name: 'CitySearch' }] });
  }, [clearCity, navigation]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <TouchableOpacity onPress={handleChangeCity} style={styles.cityButton}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <Text
            style={[typography.bodyMedium, { color: colors.text.primary, marginLeft: spacing.xs }]}
            numberOfLines={1}
          >
            {currentCity?.name || 'Şehir Seç'}
          </Text>
          <Text style={[typography.caption, { color: colors.text.tertiary, marginLeft: spacing.xs }]}>
            {currentCity?.country || ''}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={colors.text.tertiary}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={22}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <CategoryChips
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Content */}
      {isLoading ? (
        <PlaceSkeletonList count={5} />
      ) : isError ? (
        <ErrorState
          title="Yerler yüklenemedi"
          message="Overpass API'ye bağlanılamadı. Lütfen internet bağlantınızı kontrol edin."
          onRetry={() => refetch()}
        />
      ) : places && places.length === 0 ? (
        <EmptyState
          icon="compass-outline"
          title="Yer bulunamadı"
          message="Bu kategoride sonuç yok. Başka bir kategori deneyin."
        />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              onPress={handlePlacePress}
              cityLat={currentCity?.lat}
              cityLon={currentCity?.lon}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  list: {
    paddingVertical: spacing.md,
    paddingBottom: spacing['5xl'],
  },
});
