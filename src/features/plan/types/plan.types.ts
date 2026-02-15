export interface PlanItem {
  id: string;
  placeId?: string; // OSM composite ID
  placeName: string;
  lat?: number;
  lon?: number;
  category?: string;
  day: number;
  order: number;
  time?: string; // HH:MM format
  note?: string;
}

export interface DayPlan {
  day: number;
  items: PlanItem[];
}
