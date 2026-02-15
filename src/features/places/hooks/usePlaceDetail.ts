import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/lib/queryKeys';
import { fetchPlaceDetail } from '../api/overpass.endpoints';

export const usePlaceDetail = (
  osmId: number,
  osmType: 'node' | 'way' | 'relation',
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.places.detail(osmId, osmType),
    queryFn: () => fetchPlaceDetail(osmId, osmType),
    enabled,
    staleTime: 30 * 60 * 1000,
  });
};
