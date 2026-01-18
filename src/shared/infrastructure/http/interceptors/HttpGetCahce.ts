import { CachedResponse } from "@/shared/core/types/CacheTypes";
import { getCachedResponse } from "@/shared/infrastructure/cache/CacheDb";
import { generateCacheKey } from "@/shared/infrastructure/cache/CacheKey";
import { CachedAxiosResponse, CustomAxiosRequestConfig } from "@/shared/infrastructure/cache/types/CacheTypes";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Configurazione dell'istanza di Axios
 * Interceptor di Richiesta: Controlla la cache prima di inviare.
 */
export function setAxiosRequestCache(client: AxiosInstance): void {
    client.interceptors.request.use(async (config: InternalAxiosRequestConfig & CustomAxiosRequestConfig) => {
        // Solo richieste GET
        if (config.method?.toLowerCase() !== 'get') return config;

        const cacheKey = generateCacheKey(config);
        config.cacheKey = cacheKey; // Conserva la chiave per l'Interceptor di risposta
        try {
            // Tipizziamo la risposta attesa
            const cachedResponse = await getCachedResponse<CachedResponse>(cacheKey);

            if (cachedResponse) {
                // Cache Hit: Restituisce un oggetto che simula la AxiosResponse
                const fakeResponse: CachedAxiosResponse = {
                    data: cachedResponse.data,
                    status: cachedResponse.status,
                    statusText: cachedResponse.statusText,
                    headers: cachedResponse.headers,
                    config: config,
                    request: {}, // Oggetto request minimale o vuoto
                    cached: true,
                };
                // Restituendo un oggetto non-config, Axios interrompe la richiesta di rete
                return Promise.reject({ __fromCache: true, response: fakeResponse });
            }

        } catch (error) {
            // In caso di errore IndexedDB, si logga e si procede con la richiesta HTTP
            console.error("Errore critico nell'Interceptor di richiesta (IndexedDB):", error);
        }

        // Cache Miss o Errore: Restituisce la configurazione per far procedere la richiesta HTTP
        return config;

    }, (error: AxiosError) => {
        return Promise.reject(error);
    });
}