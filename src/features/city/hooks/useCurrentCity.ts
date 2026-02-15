import { useCityStore } from '../store/cityStore';

export const useCurrentCity = () => {
  const currentCity = useCityStore((state) => state.currentCity);
  const recentCities = useCityStore((state) => state.recentCities);
  const setCity = useCityStore((state) => state.setCity);
  const clearCity = useCityStore((state) => state.clearCity);

  return {
    currentCity,
    recentCities,
    setCity,
    clearCity,
    hasCity: !!currentCity,
  };
};
