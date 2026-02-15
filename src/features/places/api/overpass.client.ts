import axios, { AxiosInstance } from 'axios';
import { ENV, OVERPASS_FALLBACK_INSTANCES } from '../../../shared/constants/env';
import { overpassRateLimiter } from '../../../shared/lib/rateLimiter';
import { OverpassResponse } from '../types/place.types';

class OverpassClient {
  private client: AxiosInstance;
  private currentInstanceIndex = 0;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': ENV.APP_USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private getBaseUrl(): string {
    return OVERPASS_FALLBACK_INSTANCES[this.currentInstanceIndex] || ENV.OVERPASS_BASE_URL;
  }

  private rotateInstance(): void {
    this.currentInstanceIndex =
      (this.currentInstanceIndex + 1) % OVERPASS_FALLBACK_INSTANCES.length;
  }

  async query(overpassQuery: string): Promise<OverpassResponse> {
    return overpassRateLimiter.add(async () => {
      try {
        const response = await this.client.post<OverpassResponse>(
          this.getBaseUrl(),
          `data=${encodeURIComponent(overpassQuery)}`
        );
        return response.data;
      } catch (error: any) {
        // On timeout or 429, try the next fallback instance
        if (
          error.code === 'ECONNABORTED' ||
          error.response?.status === 429 ||
          error.response?.status === 504
        ) {
          console.warn(
            `Overpass instance failed (${this.getBaseUrl()}), trying fallback...`
          );
          this.rotateInstance();

          const response = await this.client.post<OverpassResponse>(
            this.getBaseUrl(),
            `data=${encodeURIComponent(overpassQuery)}`
          );
          return response.data;
        }

        throw error;
      }
    });
  }
}

export const overpassClient = new OverpassClient();
