import { OverpassResponse, OverpassElement, Place } from '../types/place.types';

/**
 * Parse a raw Overpass response into the app's `Place` model.
 * Only named elements that have usable coordinates are included.
 */
export const parseOverpassResponse = (response: OverpassResponse): Place[] => {
  return response.elements
    .map(parseOverpassElement)
    .filter((p): p is Place => p !== null);
};

const parseOverpassElement = (element: OverpassElement): Place | null => {
  const tags = element.tags;
  if (!tags || !tags.name) return null;

  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat === undefined || lon === undefined) return null;

  const category = determineCategory(tags);

  // Try to get image from various OSM tag sources
  const image =
    tags.image ||
    tags['image:wikimedia'] ||
    tags.wikimedia_commons ||
    tags['wikimedia:commons'] ||
    (tags.wikidata ? `https://commons.wikimedia.org/wiki/Special:EntityData/${tags.wikidata}.json` : undefined);

  return {
    id: `${element.type}_${element.id}`,
    osmId: element.id,
    osmType: element.type,
    name: tags['name:en'] || tags.name,
    lat,
    lon,
    category,
    tags,
    description: tags['description:en'] || tags.description,
    wikipedia: tags.wikipedia,
    wikidata: tags.wikidata,
    website: tags.website,
    phone: tags.phone,
    openingHours: tags.opening_hours,
    image,
  };
};

const determineCategory = (
  tags: Record<string, string | undefined>
): string => {
  if (tags.tourism === 'museum') return 'museums';
  if (tags.tourism === 'viewpoint') return 'viewpoints';
  if (tags.tourism === 'attraction') return 'attractions';
  if (tags.tourism === 'gallery') return 'culture';
  if (tags.historic) return 'historic';
  if (tags.leisure === 'park' || tags.leisure === 'garden') return 'parks';
  if (tags.natural) return 'parks';
  if (
    tags.amenity === 'theatre' ||
    tags.amenity === 'cinema' ||
    tags.amenity === 'arts_centre'
  )
    return 'culture';
  if (tags.amenity === 'place_of_worship') return 'religion';
  if (
    tags.amenity === 'restaurant' ||
    tags.amenity === 'cafe' ||
    tags.amenity === 'fast_food'
  )
    return 'food';
  return 'popular';
};
