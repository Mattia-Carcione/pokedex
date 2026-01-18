// types.ts
import { AxiosRequestConfig, AxiosResponse } from 'axios';

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