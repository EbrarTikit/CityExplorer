import { Region } from 'react-native-maps';

export const cityToRegion = (lat: number, lon: number, radiusKm: number = 5): Region => {
  const latDelta = radiusKm / 111; // ~111 km per degree
  const lonDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  return {
    latitude: lat,
    longitude: lon,
    latitudeDelta: latDelta * 2,
    longitudeDelta: lonDelta * 2,
  };
};

export const regionToRadius = (region: Region): number => {
  const latKm = (region.latitudeDelta / 2) * 111;
  const lonKm =
    (region.longitudeDelta / 2) *
    111 *
    Math.cos((region.latitude * Math.PI) / 180);
  return Math.round(Math.max(latKm, lonKm) * 1000); // in meters
};
