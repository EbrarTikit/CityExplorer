import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/lib/queryKeys';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { nominatimClient } from '../api/nominatim.client';
import { parseNominatimResults } from '../utils/parseNominatim';

export const useCitySearch = (searchQuery: string) => {
  const debouncedQuery = useDebounce(searchQuery, 500);

  return useQuery({
    queryKey: queryKeys.city.search(debouncedQuery),
    queryFn: async () => {
      const results = await nominatimClient.search(debouncedQuery);
      return parseNominatimResults(results);
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
