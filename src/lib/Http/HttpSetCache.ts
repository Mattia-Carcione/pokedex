import { setCachedResponse } from "@/cache/cacheDb";
import { CachedAxiosResponse } from "@/cache/types/cacheTypes";
import { AxiosError, AxiosInstance } from "axios";

/**
 * Interceptor di Risposta: Memorizza la risposta in cache.
 */
export function setAxiosResponseCache(client: AxiosInstance): void {
    client.interceptors.response.use(async (response: CachedAxiosResponse) => {
        const shouldCache = response.config.method?.toLowerCase() === 'get' &&
            response.status >= 200 && response.status < 300 &&
            !response.cached && response.config.cacheKey;

        if (shouldCache) {
            // La funzione setCachedResponse è tipizzata per accettare AxiosResponse
            await setCachedResponse(response.config.cacheKey!, response);
        }

        // Restituisce sempre la risposta originale (o cachata)
        return response;

    }, (error: any) => {
        if (error.__fromCache && error.response) return Promise.resolve({
            ...error.response,
            cached: true
        });
        return Promise.reject(error);
    });
}