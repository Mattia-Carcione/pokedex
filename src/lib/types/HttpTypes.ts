import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export interface ExtendedRequestConfig extends AxiosRequestConfig {
    cacheTTL?: number;
    /** enable/disable cache */
    cache?: boolean;
}

export interface ExtendedInternalConfig
    extends InternalAxiosRequestConfig {
    cache?: boolean;
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
    value: string;
    class: string;
}