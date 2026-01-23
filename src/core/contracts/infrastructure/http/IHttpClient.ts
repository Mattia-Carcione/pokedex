/**
 * Interfaccia per un client HTTP generico.
 */
export interface IHttpClient {
    /**
     * Effettua una richiesta GET a un URL specificato e restituisce una promessa con i dati tipizzati.
     * @param url - L'URL a cui effettuare la richiesta GET.
     * @returns Una promessa che risolve i dati della risposta tipizzati come T.
     */
    get<T>(url: string, options?: any): Promise<T>;
}