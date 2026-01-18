import axios, { AxiosError } from "axios";
import { NormalizedHttpError } from "./NormalizedHttpError";
import { AxiosErrorCode } from "./AxiosErrorCode";
import { ErrorType } from "@/shared/core/enums/ErrorType";

/**
 * Normalizza qualsiasi errore Axios in una struttura unica, scalabile e facile da gestire.
 */
export function normalizeAxiosError(err: unknown): NormalizedHttpError {
    if (axios.isAxiosError(err)) {
        const e = err as AxiosError;

        // Timeout
        if (e.code === AxiosErrorCode.ECONNABORTED)
            return new NormalizedHttpError(ErrorType.TIMEOUT, undefined, e.config?.url, e.message ?? "Timeout");

        // Errore di rete
        if (e.code === AxiosErrorCode.NETWORK_ERROR || e.message?.includes("Network Error"))
            return new NormalizedHttpError(ErrorType.NETWORK, undefined, e.config?.url, e.message ?? "Network Error");
        
        // Errore HTTP (404, 500, ecc.)
        if (e.response)
            return new NormalizedHttpError(ErrorType.HTTP, e.response.status, e.config?.url, `HTTP ${e.response.status}`);

        // Errore Axios ma senza response
        return new NormalizedHttpError(ErrorType.UNKNOWN, undefined, e.config?.url, e.message);
    }

    // Errore non Axios
    return new NormalizedHttpError(ErrorType.UNKNOWN, undefined, undefined, String(err));
}