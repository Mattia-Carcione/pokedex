import { AxiosRequestConfig } from 'axios';

/**
 * Estensione dell'oggetto Config di axios per il retry.
 * 
 * L'oggetto Config:
 * 
 * Permette di personalizzare ogni aspetto della richiesta URL:
 * - axios.get(url, config)
 * 
 * Permette di configurare le istanze di axios create:
 * - axios.create(config)
 * 
 * Permette di essere manipolato dagli intercettori di richiesta axios.
 * 
 * L'oggetto di estensione Config per il retry aggiunge attributi necessari per il retry.
 * 
 * - retry? (number) - numero di tentativi da eseguire.
 * - retryDelay? (number) - ritardo tra un tentativo e l'altro.
 * - __retryCount? (number) - contatore di tentativi effettuati.
 * - jitter? ('none', 'equal', 'full', 'decorreleted') - ritardo casuale.
 * 
 * @extends AxiosRequestConfig
 */
export interface RetryAxiosRequestConfig extends AxiosRequestConfig {
    /**
     * numero di tentativi da eseguire.
     */
    retry: number;
    /**
     * ritardo in ms tra un tentativo e l'altro.
     */
    retryDelay: number;
    /**
     * contatore di tentativi effettuati.
     */
    __retryCount?: number;
    /**
     * Variazione casuale aggiunta al tempo di attesa calcolato dal backoff
     */
    jitter: 'full' | 'equal' | 'decorrelated' | 'none';
}

export interface ExtendedRequestConfig extends AxiosRequestConfig {
    cacheTTL?: number;
    /** enable/disable cache */
    cache?: boolean;
}

/**
 * Configurazione default di RetryAxiosRequestConfig.
 * - retry: 3
 * - retryDelay: 1000
 * - jitter: full
 */
export const DEFAULT_OPTS: RetryAxiosRequestConfig = {
    retry: 3,
    retryDelay: 1000,
    jitter: "full"
}

/**
 * Rappresenta un errore Axios normalizzato in una struttura coerente.
 */
export interface NormalizedHttpError {
    type: "network" | "timeout" | "http" | "unknown";
    status?: number;
    url?: string;
    message: string;
}

export interface ErrorValue {
    method: "get" | "post" | "update" | "delete";
    function: string;
    value?: string;
    class: string;
}