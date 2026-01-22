import axios, { AxiosError } from "axios";
import { IHttpError } from "../../../types/IHttpError";
import { Retry } from "@/infrastructure/http/utils/Retry";

/**
 * Verifica se un errore Axios è retryable
 * @param err - AxiosError
 * @returns boolean - true se l'errore è retryable, false altrimenti
 */
export class AxiosRetry {
    private constructor() {}

    static isRetryableAxiosError(err: AxiosError): boolean {
        const httpError: IHttpError = {
            response: err.response,
            status: err.response?.status,
            isCanceled: axios.isCancel(err)
        }

        return Retry.isRetryableError(httpError);
    }
}