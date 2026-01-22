import axios, { AxiosError } from "axios";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { ErrorTypeEnum } from "../../../enums/ErrorTypeEnum";
import { AxiosErrorEnum } from "../enums/AxiosErrorEnum";

/**
 * Rappresenta un errore Axios normalizzato in una struttura coerente.
 */
export class HttpAxiosError extends HttpError {
    constructor(err: unknown) {
        if(axios.isAxiosError(err)) {
            const e = err as AxiosError;
            if (e.code === AxiosErrorEnum.ECONNABORTED)
                super(ErrorTypeEnum.TIMEOUT, undefined, e.config?.url ?? "unknown URL", e.message ?? "Timeout"); 

            else if (e.code === AxiosErrorEnum.NETWORK_ERROR || e.message?.includes("Network Error"))
                super(ErrorTypeEnum.NETWORK, undefined, e.config?.url ?? "unknown URL", e.message ?? "Network Error");

            else if (e.response)
                super(ErrorTypeEnum.HTTP, e.response.status, e.config?.url ?? "unknown URL", `HTTP ${e.response.status}`);

            else super(ErrorTypeEnum.UNKNOWN, undefined, e.config?.url ?? "unknown URL", e.message);
        }
        else super(ErrorTypeEnum.UNKNOWN, undefined, undefined, String(err)) 
    }
}