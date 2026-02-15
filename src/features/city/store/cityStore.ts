import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { City } from '../types/city.types';

interface CityState {
  currentCity: City | null;
  recentCities: City[];
  setCity: (city: City) => void;
  clearCity: () => void;
}

const MAX_RECENT = 5;

export const useCityStore = create<CityState>()(
  persist(
    (set, get) => ({
      currentCity: null,
      recentCities: [],

      setCity: (city) => {
        const recent = get().recentCities.filter((c) => c.id !== city.id);
        set({
          currentCity: city,
          recentCities: [city, ...recent].slice(0, MAX_RECENT),
        });
      },

      clearCity: () => set({ currentCity: null }),
    }),
    {
      name: 'city-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
