import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/lib/queryKeys';
import { fetchPlaces } from '../../places/api/overpass.endpoints';
import { CATEGORIES } from '../../places/utils/categories';

interface UseMapPlacesParams {
  lat: number;
  lon: number;
  radius: number;
  categoryId: string;
  enabled?: boolean;
}

export const useMapPlaces = ({
  lat,
  lon,
  radius,
  categoryId,
  enabled = true,
}: UseMapPlacesParams) => {
  const category = CATEGORIES.find((c) => c.id === categoryId);

  return useQuery({
    queryKey: queryKeys.places.map({ lat, lon, radius, category: categoryId }),
    queryFn: () =>
      fetchPlaces({
        lat,
        lon,
        radius,
        osmTags: category!.osmTags,
      }),
    enabled: enabled && !!category && lat !== 0 && lon !== 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
