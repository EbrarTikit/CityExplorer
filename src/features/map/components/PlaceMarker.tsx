import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '../../places/types/place.types';
import { getCategoryColor, getCategoryById } from '../../places/utils/categories';

interface PlaceMarkerProps {
  place: Place;
  onPress: (place: Place) => void;
}

export const PlaceMarker: React.FC<PlaceMarkerProps> = React.memo(
  ({ place, onPress }) => {
    const color = getCategoryColor(place.category);
    const category = getCategoryById(place.category);

    return (
      <Marker
        coordinate={{ latitude: place.lat, longitude: place.lon }}
        onPress={() => onPress(place)}
        tracksViewChanges={false}
      >
        <View style={[styles.marker, { backgroundColor: color }]}>
          <Ionicons
            name={(category?.icon as any) || 'location'}
            size={14}
            color="#ffffff"
          />
        </View>
        <View style={[styles.arrow, { borderTopColor: color }]} />
      </Marker>
    );
  }
);

PlaceMarker.displayName = 'PlaceMarker';

const styles = StyleSheet.create({
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -2,
  },
});
