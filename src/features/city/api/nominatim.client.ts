import axios, { AxiosInstance } from 'axios';
import { ENV } from '../../../shared/constants/env';
import { nominatimRateLimiter } from '../../../shared/lib/rateLimiter';
import { NominatimPlace } from '../types/city.types';

class NominatimClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.NOMINATIM_BASE_URL,
      timeout: 10000,
      headers: {
        'User-Agent': ENV.APP_USER_AGENT,
        Accept: 'application/json',
      },
    });
  }

  async search(query: string, lang: string = 'en'): Promise<NominatimPlace[]> {
    return nominatimRateLimiter.add(async () => {
      const params = new URLSearchParams({
        q: query,
        format: 'jsonv2',
        addressdetails: '1',
        limit: '8',
        'accept-language': lang,
        dedupe: '1',
        featuretype: 'city',
      });

      const response = await this.client.get<NominatimPlace[]>(
        `/search?${params.toString()}`
      );
      return response.data;
    });
  }

  async reverse(
    lat: number,
    lon: number,
    lang: string = 'en'
  ): Promise<NominatimPlace> {
    return nominatimRateLimiter.add(async () => {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'jsonv2',
        addressdetails: '1',
        zoom: '10',
        'accept-language': lang,
      });

      const response = await this.client.get<NominatimPlace>(
        `/reverse?${params.toString()}`
      );
      return response.data;
    });
  }
}

export const nominatimClient = new NominatimClient();
