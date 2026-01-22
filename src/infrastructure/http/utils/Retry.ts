import { StatusCodeEnum } from "../enums/StatusCodeEnum";
import { IHttpError } from "../types/IHttpError";

/**
 * Verifica se un errore HTTP è retryable
 * @param err - IHttpError
 * @returns boolean - true se l'errore è retryable, false altrimenti
 */
export class Retry {
    private constructor() {}

    static isRetryableError (err: IHttpError): boolean {
        const transientStatusCodes = [
            StatusCodeEnum.GATEWAY_TIMEOUT,
            StatusCodeEnum.INTERNAL_SERVER_ERROR,
            StatusCodeEnum.SERVICE_UNAVAILABLE,
            StatusCodeEnum.TOO_MANY_REQUESTS
        ];

        if(err.response && err.status && transientStatusCodes.includes(err.status))
            return true;

        if(!err.response && !err.isCanceled)
            return true;
        
        return false;
    }
}