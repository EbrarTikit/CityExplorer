import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/lib/queryKeys';
import { fetchPlaces } from '../api/overpass.endpoints';
import { useCityStore } from '../../city/store/cityStore';
import { CATEGORIES } from '../utils/categories';

export const usePlaces = (categoryId: string, radius: number = 5000) => {
  const currentCity = useCityStore((state) => state.currentCity);
  const category = CATEGORIES.find((c) => c.id === categoryId);

  return useQuery({
    queryKey: queryKeys.places.list({
      lat: currentCity?.lat || 0,
      lon: currentCity?.lon || 0,
      radius,
      category: categoryId,
    }),
    queryFn: () =>
      fetchPlaces({
        lat: currentCity!.lat,
        lon: currentCity!.lon,
        radius,
        osmTags: category!.osmTags,
      }),
    enabled: !!currentCity && !!category,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 429) return false;
      return failureCount < 2;
    },
  });
};
