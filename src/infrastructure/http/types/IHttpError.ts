/**
 * Interfaccia che rappresenta un errore HTTP.
 */
export interface IHttpError {
    response: any | undefined;
    status: number | undefined;
    isCanceled: boolean;
}