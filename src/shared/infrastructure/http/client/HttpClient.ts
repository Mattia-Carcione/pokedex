import { IHttpClient } from '@/shared/core/interfaces/shared/infrastructure/http/IHttpClient';
import { CachedAxiosResponse } from '@/shared/infrastructure/cache/types/CacheTypes';
import { AxiosInstance } from 'axios';
import { normalizeAxiosError } from '../errors/NormalizeAxiosError';

/**
 * Implementazione di IHttpClient utilizzando Axios.
 */
export class AxiosHttpClient implements IHttpClient {
  constructor(private client: AxiosInstance) {}

  async get<T>(url: string): Promise<T> {
    try {
      const response: CachedAxiosResponse<T> = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw normalizeAxiosError(error);
    }
  }
}