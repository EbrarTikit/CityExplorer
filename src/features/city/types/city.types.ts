export interface City {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  country: string;
  countryCode: string;
}

export interface NominatimPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}
