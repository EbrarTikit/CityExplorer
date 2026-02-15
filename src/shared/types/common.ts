export interface Coordinates {
  lat: number;
  lon: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
