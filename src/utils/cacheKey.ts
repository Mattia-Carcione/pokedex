import { CustomAxiosRequestConfig } from "@/cache/types/cacheTypes";

/**
 * Genera una chiave unica per la richiesta.
 * @param {CustomAxiosRequestConfig} config La configurazione della richiesta.
 * @returns {string} La chiave di cache univoca.
 */
export function generateCacheKey(config: CustomAxiosRequestConfig): string {
    const params = config.params ? JSON.stringify(config.params) : '';
    const method = config.method ? config.method.toUpperCase() : 'GET';
    return `${method}:${config.url}?${params}`;
}