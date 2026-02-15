export interface Place {
  id: string; // Composite: "node_123456"
  osmId: number;
  osmType: 'node' | 'way' | 'relation';
  name: string;
  lat: number;
  lon: number;
  category: string;
  tags: Record<string, string | undefined>;

  // Optional fields from OSM tags
  description?: string;
  wikipedia?: string;
  wikidata?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  image?: string;
}

export interface OverpassResponse {
  version: number;
  generator: string;
  elements: OverpassElement[];
}

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
}
