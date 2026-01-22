import { IHttpClient } from "./IHttpClient";

/**
 * Interfaccia per una factory di client HTTP.
 */
export interface IHttpClientFactory {
    /**
     * Crea un'istanza di IHttpClient con le configurazioni specificate.
     * @param baseUrl - L'URL di base per le richieste HTTP.
     * @param opts - Opzioni di configurazione per il client HTTP.
     * @returns Un'istanza di IHttpClient configurata.
     */
    create(baseUrl?: string, opts?: any): IHttpClient;
}