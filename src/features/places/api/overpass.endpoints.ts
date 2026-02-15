import { overpassClient } from './overpass.client';
import {
  buildOverpassQuery,
  OverpassQueryParams,
} from '../utils/buildOverpassQuery';
import { parseOverpassResponse } from '../utils/parseOverpass';
import { Place, OverpassResponse } from '../types/place.types';

export const fetchPlaces = async (
  params: OverpassQueryParams
): Promise<Place[]> => {
  const query = buildOverpassQuery(params);
  const response: OverpassResponse = await overpassClient.query(query);
  return parseOverpassResponse(response);
};

export const fetchPlaceDetail = async (
  osmId: number,
  osmType: 'node' | 'way' | 'relation'
): Promise<Place | null> => {
  const query = `[out:json][timeout:10];
${osmType}(${osmId});
out center tags;`.trim();

  const response: OverpassResponse = await overpassClient.query(query);
  const places = parseOverpassResponse(response);
  return places[0] || null;
};
