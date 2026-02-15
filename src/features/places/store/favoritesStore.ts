import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place } from '../types/place.types';

interface FavoritePlace {
  id: string;
  osmId: number;
  osmType: string;
  name: string;
  lat: number;
  lon: number;
  category: string;
  addedAt: number;
}

interface FavoritesState {
  favorites: FavoritePlace[];
  addFavorite: (place: Place) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (place: Place) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (place) => {
        if (get().favorites.some((f) => f.id === place.id)) return;
        const fav: FavoritePlace = {
          id: place.id,
          osmId: place.osmId,
          osmType: place.osmType,
          name: place.name,
          lat: place.lat,
          lon: place.lon,
          category: place.category,
          addedAt: Date.now(),
        };
        set({ favorites: [fav, ...get().favorites] });
      },

      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },

      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      toggleFavorite: (place) => {
        if (get().isFavorite(place.id)) {
          get().removeFavorite(place.id);
        } else {
          get().addFavorite(place);
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
