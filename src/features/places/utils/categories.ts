export type PlaceCategoryId =
  | 'popular'
  | 'historic'
  | 'museums'
  | 'attractions'
  | 'viewpoints'
  | 'parks'
  | 'culture'
  | 'religion'
  | 'food';

export interface PlaceCategory {
  id: PlaceCategoryId;
  title: string;
  icon: string;
  osmTags: string[];
  color: string;
}

export const CATEGORIES: PlaceCategory[] = [
  {
    id: 'popular',
    title: 'Popüler',
    icon: 'star',
    osmTags: [
      '["tourism"~"attraction|museum|gallery|viewpoint"]',
      '["historic"~"castle|monument|memorial|ruins"]',
    ],
    color: '#f59e0b',
  },
  {
    id: 'museums',
    title: 'Müzeler',
    icon: 'business',
    osmTags: ['["tourism"="museum"]'],
    color: '#8b5cf6',
  },
  {
    id: 'historic',
    title: 'Tarihi',
    icon: 'time',
    osmTags: [
      '["historic"]',
      '["tourism"~"castle|monument"]',
    ],
    color: '#ef4444',
  },
  {
    id: 'attractions',
    title: 'Gezilecek',
    icon: 'compass',
    osmTags: ['["tourism"="attraction"]'],
    color: '#ec4899',
  },
  {
    id: 'viewpoints',
    title: 'Manzara',
    icon: 'eye',
    osmTags: ['["tourism"="viewpoint"]'],
    color: '#06b6d4',
  },
  {
    id: 'parks',
    title: 'Parklar',
    icon: 'leaf',
    osmTags: [
      '["leisure"="park"]',
      '["leisure"="garden"]',
    ],
    color: '#10b981',
  },
  {
    id: 'culture',
    title: 'Kültür',
    icon: 'color-palette',
    osmTags: [
      '["amenity"~"theatre|cinema|arts_centre"]',
      '["tourism"="gallery"]',
    ],
    color: '#a855f7',
  },
  {
    id: 'religion',
    title: 'Dini',
    icon: 'home',
    osmTags: [
      '["amenity"="place_of_worship"]',
      '["building"~"church|mosque|synagogue|temple"]',
    ],
    color: '#6366f1',
  },
  {
    id: 'food',
    title: 'Yeme-İçme',
    icon: 'restaurant',
    osmTags: [
      '["amenity"~"restaurant|cafe|fast_food"]',
    ],
    color: '#f97316',
  },
];

export const getCategoryById = (id: string): PlaceCategory | undefined =>
  CATEGORIES.find((c) => c.id === id);

export const getCategoryColor = (id: string): string =>
  getCategoryById(id)?.color || '#6b7280';
