export interface OverpassQueryParams {
  lat: number;
  lon: number;
  radius: number; // meters (e.g., 5000 = 5km)
  osmTags: string[];
  timeout?: number;
}

/**
 * Build an OverpassQL query to fetch POIs around a given location.
 *
 * Uses `nwr` (node/way/relation) combined with the `around` filter
 * and `out center tags` so ways & relations also return a center coordinate.
 */
export const buildOverpassQuery = (params: OverpassQueryParams): string => {
  const { lat, lon, radius, osmTags, timeout = 25 } = params;

  const filters = osmTags
    .map((tag) => `  nwr(around:${radius},${lat},${lon})${tag};`)
    .join('\n');

  return `[out:json][timeout:${timeout}];
(
${filters}
);
out center tags;`.trim();
};
