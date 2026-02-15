import { City, NominatimPlace } from '../types/city.types';

export const parseNominatimToCity = (place: NominatimPlace): City => {
  const cityName =
    place.address.city ||
    place.address.town ||
    place.address.village ||
    place.display_name.split(',')[0];

  return {
    id: `nominatim_${place.place_id}`,
    name: cityName,
    displayName: place.display_name,
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
    country: place.address.country || '',
    countryCode: place.address.country_code || '',
  };
};

export const parseNominatimResults = (places: NominatimPlace[]): City[] => {
  return places
    .filter(
      (p) =>
        p.address.city || p.address.town || p.address.village || p.type === 'city'
    )
    .map(parseNominatimToCity);
};
