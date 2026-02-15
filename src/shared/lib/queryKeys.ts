export const queryKeys = {
  city: {
    search: (q: string) => ['city', 'search', q] as const,
    reverse: (lat: number, lon: number) =>
      ['city', 'reverse', lat, lon] as const,
  },

  places: {
    list: (args: {
      lat: number;
      lon: number;
      radius: number;
      category: string;
    }) => ['places', 'list', args] as const,

    map: (args: {
      lat: number;
      lon: number;
      radius: number;
      category: string;
    }) => ['places', 'map', args] as const,

    detail: (osmId: number, osmType: string) =>
      ['places', 'detail', osmId, osmType] as const,
  },

  favorites: {
    all: () => ['favorites', 'all'] as const,
  },

  plan: {
    all: () => ['plan', 'all'] as const,
  },
} as const;
