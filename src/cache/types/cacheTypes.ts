// types.ts
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Interfaccia per l'oggetto risposta leggera salvato in IndexedDB.
 * Deve contenere solo dati serializzabili (senza riferimenti ciclici o complessi).
 */
export interface LightweightAxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: { url?: string; method?: string };
}

/**
 * Interfaccia per l'elemento completo memorizzato in IndexedDB.
 */
export interface CachedItem<T = any> {
    key: string; // La chiave di cache, usata come keyPath
    response: LightweightAxiosResponse<T>;
    expiry: number; // Timestamp di scadenza (Date.now() + CACHE_LIFETIME_MS)
    cachedAt: number;
}

/**
 * Estende l'oggetto AxiosRequestConfig per includere i nostri campi personalizzati
 * e per facilitare l'uso nell'Interceptor.
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    cacheKey?: string;
}

/**
 * Estende l'oggetto AxiosResponse per indicare se la risposta proviene dalla cache.
 */
export interface CachedAxiosResponse<T = any> extends AxiosResponse<T> {
    cached?: boolean;
    config: AxiosResponse<T>["config"] & CustomAxiosRequestConfig;
}