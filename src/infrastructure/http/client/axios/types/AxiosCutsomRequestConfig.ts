import { AxiosRequestConfig } from "axios";

/**
 * Estende l'interfaccia AxiosRequestConfig per includere il supporto per AbortSignal.
 */
export interface AxiosCustomRequestConfig extends AxiosRequestConfig {
    signal?: AbortSignal;
}