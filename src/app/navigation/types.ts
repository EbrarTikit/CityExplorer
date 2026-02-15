import { Place } from '../../features/places/types/place.types';

export type RootStackParamList = {
  CitySearch: undefined;
  MainTabs: undefined;
  PlaceDetail: { place: Place };
};

export type TabParamList = {
  Explore: undefined;
  Map: undefined;
  Plan: undefined;
  Favorites: undefined;
};
