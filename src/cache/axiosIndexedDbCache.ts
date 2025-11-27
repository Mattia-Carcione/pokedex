/**
* cache/axiosIndexedDbCache
*
* Integra IndexedDbStore con Axios tramite interceptor.
* Fornisce:
* - Lettura dalla cache sul request interceptor (per GET)
* - Scrittura nel response interceptor
* - API per invalidazione manuale
* - Supporto TTL per singola request via config.cacheTTL
* - Respect per config.cache === false
* - Deduplication (in-flight request coalescing)
*
* Design choices:
* - usiamo key derivata da method|url|params|data
* - salviamo l'intera struttura CachedResponse nel DB
* - per deduplication teniamo una mappa in-memory di promesse "in flight"
*/

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IndexedDbStore } from './indexedDb';
import type { CachedResponse } from "../types/cache";
import { buildCacheKey } from "../utils/cacheKey";
import { now } from "../utils/clock";
import type { ExtendedInternalConfig } from "../lib/types/HttpTypes";
const DB_NAME = "app-cache-db";
const STORE_NAME = "cache";

// in-memory map to deduplicate concurrent requests for the same cache key
const inFlightRequests = new Map<string, Promise<AxiosResponse<any>> | null>();

const store = new IndexedDbStore<CachedResponse>(DB_NAME, STORE_NAME, 1);

/**
* opzioni di default
*/
const DEFAULT_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 giorni

export function setupAxiosIndexedDbCache(client: AxiosInstance) {
    // request interceptor: tentiamo di rispondere dalla cache per GET
    client.interceptors.request.use(async (config: ExtendedInternalConfig) => {
        try {
            // solo GET idempotenti, saltare quando esplicitamente richiesto
            if ((config.method || "get").toLowerCase() !== "get") return config;
            if (config.cache === false) return config; // forza bypass della cache

            const key = buildCacheKey(config);

            // check in-memory for in-flight promise (deduplication)
            const inFlight = inFlightRequests.get(key);
            if (inFlight) {
                // se c'è una richiesta in corso, aspettala e poi ritornare la response
                const resp = await inFlight;
                // Axios non supporta ritornare response dal request interceptor direttamente,
                // perciò usiamo lo stesso trick: rifiutare con un segnale riconoscibile
                return Promise.reject({ __fromCache: true, cachedData: resp });
            }

            // leggere dalla indexeddb
            const entry = await store.get(key);
            if (!entry) return config;

            // check scadenza
            if (entry.expiresAt !== null && now() > entry.expiresAt) {
                // expired -> rimuovi e procedi con la request reale
                await store.delete(key);
                return config;
            }

            // trovato dato valido: ricostruisco un oggetto AxiosResponse simulate
            const fakeResponse: AxiosResponse = {
                data: entry.data,
                status: entry.status,
                statusText: String(entry.status),
                headers: entry.headers,
                config,
            } as AxiosResponse;
            (fakeResponse as any).fromCache = true;

            // rifiuto con segnale intercettabile
            return Promise.reject({ __fromCache: true, cachedData: fakeResponse });
        } catch (err) {
            // in caso di problemi con IDB non blocchiamo la request: procediamo
            return config;
        }
    }, (err) => Promise.reject(err));

    // response interceptor: salviamo le response GET in cache
    client.interceptors.response.use(async (response) => {
        try {
            const config = response.config as ExtendedInternalConfig & { cacheTTL?: number | null };
            if ((config.method || "get").toLowerCase() !== "get") return response;
            if (config.cache === false) return response; // bypass

            const key = buildCacheKey(config);
            const ttl = typeof config.cacheTTL === "number" ? config.cacheTTL : DEFAULT_TTL_MS;
            const respToSave: CachedResponse = {
                data: response.data,
                headers: response.headers || {},
                status: response.status,
                savedAt: now(),
                expiresAt: ttl ? now() + ttl : null,
            };

            // salva su IndexedDB (non await per non bloccare risposta, ma gestiamo promise)
            store.set(key, respToSave).catch((e) => {
                // se il DB fallisce, non vogliamo rompere la response
                console.warn("Failed saving cache entry", e);
            });

            return response;
        } finally {
            // pulire l'eventuale inFlight map
            const config = response.config;
            const key = buildCacheKey(config);
            inFlightRequests.delete(key);
        }
    }, (error) => {
        // gestiamo il caso in cui il request interceptor abbia rifiutato con il nostro segnale
        if (error && (error as any).__fromCache) {
            const cached: AxiosResponse = (error as any).cachedData;
            return Promise.resolve(cached);
        }

        // altrimenti reject come prima
        return Promise.reject(error);
    });

    // wrapping request method to implement deduplication: se due chiamate identiche vengono fatte
    // quasi contemporaneamente, salviamo la promessa in inFlightRequests e la condividiamo.
    const originalRequest = client.request.bind(client);
    client.request = async function (config: ExtendedInternalConfig) {
        const method = (config.method || "get").toLowerCase();
        if (method !== "get" || config.cache === false) {
            return originalRequest(config);
        }

        const key = buildCacheKey(config);

        // se già in volo, ritorna la stessa promessa
        const existing = inFlightRequests.get(key);
        if (existing) return existing;

        const prom = originalRequest(config)
            .then((r) => r)
            .catch((e) => {
                // se errore dalla cache segnalato, Axios lo converte prima nelle intercepetor
                throw e;
            }) as Promise<AxiosResponse<any>>;

        inFlightRequests.set(key, prom);

        // quando finisce, rimuoviamo
        prom.finally(() => inFlightRequests.delete(key));

        return prom;
    } as any;
}