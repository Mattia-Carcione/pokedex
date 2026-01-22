/**
* utils/cacheKey
*
* Costruisce la cache key in modo predicibile e collision-safe per le richieste axios.
* Include: method, url, sorted params, body (data).
*/

import qs from "qs";
import type { AxiosRequestConfig } from "axios";
import { CustomAxiosRequestConfig } from "../http/client/axios/types/CacheAxiosConfig";

/**
 * Factory per la generazione di chiavi di cache uniche basate sulla configurazione della richiesta.
 */
export class CacheKeyFactory {
    private constructor() {}

    /**
    * Normalizza e serializza params in modo che l'ordine dei campi non cambi la key.
    */
    private static serializeParams(params: any) {
        if (!params) return "";
        try {
            // utilizziamo qs per ordinare le keys (puoi sostituire con JSON.stringify su oggetti piccoli)
            return qs.stringify(params, { sort: (a: any, b: any) => (a > b ? 1 : -1), arrayFormat: "brackets" });
        } catch (e) {
            return JSON.stringify(params);
        }
    }

    /**
     * Helper per la creazione della chiave di cache
     * @param config - AxiosRequestConfig
     * @returns la chiave di cache
     */
    static buildCacheKey(config: AxiosRequestConfig): string {
        const method = (config.method || "get").toLowerCase();
        const url = config.url || "";
        const paramsString = this.serializeParams(config.params);
        const dataString = config.data ? JSON.stringify(config.data) : "";
        return `${method.toUpperCase()}:${url}?${paramsString}::${dataString}`;
    }

    /**
     * Genera una chiave unica per la richiesta.
     * @param {CustomAxiosRequestConfig} config La configurazione della richiesta.
     * @returns {string} La chiave di cache univoca.
     */
    static generateCacheKey(config: CustomAxiosRequestConfig): string {
        const params = config.params ? JSON.stringify(config.params) : '';
        // Assicuriamo che method sia una stringa
        const method = config.method ? config.method.toUpperCase() : 'GET';
        return `${method}:${config.url}?${params}`; 
    }
}