export const ENV = {
  NOMINATIM_BASE_URL:
    process.env.EXPO_PUBLIC_NOMINATIM_BASE_URL ||
    'https://nominatim.openstreetmap.org',
  OVERPASS_BASE_URL:
    process.env.EXPO_PUBLIC_OVERPASS_BASE_URL ||
    'https://overpass-api.de/api/interpreter',
  APP_USER_AGENT: 'CityExplorerApp/1.0 (contact@cityexplorer.dev)',
} as const;

export const OVERPASS_FALLBACK_INSTANCES = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
] as const;
