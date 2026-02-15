import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing } from '../../../shared/theme/spacing';
import { RootStackParamList } from '../../../app/navigation/types';
import { useCurrentCity } from '../../city/hooks/useCurrentCity';
import { useMapPlaces } from '../hooks/useMapPlaces';
import { CategoryChips } from '../../places/components/CategoryChips';
import { PlaceMarker } from '../components/PlaceMarker';
import { PlaceBottomSheet } from '../components/PlaceBottomSheet';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { cityToRegion } from '../utils/region';
import { Place } from '../../places/types/place.types';
import { useDebounce } from '../../../shared/hooks/useDebounce';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const MapScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { currentCity } = useCurrentCity();
  const mapRef = useRef<MapView>(null);

  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: currentCity?.lat || 41.0082,
    lon: currentCity?.lon || 28.9784,
  });

  const debouncedCenter = useDebounce(mapCenter, 500);

  const { data: places, isLoading } = useMapPlaces({
    lat: debouncedCenter.lat,
    lon: debouncedCenter.lon,
    radius: 5000,
    categoryId: selectedCategory,
    enabled: !!currentCity,
  });

  const initialRegion = useMemo(
    () =>
      currentCity
        ? cityToRegion(currentCity.lat, currentCity.lon, 5)
        : cityToRegion(41.0082, 28.9784, 5),
    [currentCity]
  );

  const handleRegionChangeComplete = useCallback((region: Region) => {
    setMapCenter({
      lat: region.latitude,
      lon: region.longitude,
    });
  }, []);

  const handleMarkerPress = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const handleViewDetail = useCallback(
    (place: Place) => {
      setSelectedPlace(null);
      navigation.navigate('PlaceDetail', { place });
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton
        userInterfaceStyle={isDark ? 'dark' : 'light'}
      >
        {places?.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>

      {/* Category filter overlay */}
      <SafeAreaView style={styles.filterOverlay} edges={['top']}>
        <CategoryChips
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </SafeAreaView>

      {/* Loading indicator */}
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.overlay }]}>
          <LoadingSpinner message="Yerler yükleniyor..." />
        </View>
      )}

      {/* Bottom sheet */}
      {selectedPlace && (
        <PlaceBottomSheet
          place={selectedPlace}
          onClose={handleCloseSheet}
          onViewDetail={handleViewDetail}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  loadingOverlay: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    borderRadius: 16,
    padding: spacing.lg,
  },
});
