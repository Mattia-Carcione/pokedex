import axios, { AxiosError } from "axios";
import { ErrorValue, NormalizedHttpError } from "../types/HttpTypes";

/**
 * Normalizza qualsiasi errore Axios in una struttura unica, scalabile e facile da gestire.
 */
function normalizeAxiosError(err: unknown): NormalizedHttpError {
    if (axios.isAxiosError(err)) {
        const e = err as AxiosError;

        // Timeout o errore di rete
        if (e.code === "ECONNABORTED" || e.message.includes("Network Error"))
            return { type: "network", url: e.config?.url, message: e.message, };

        // Errore HTTP (404, 500, ecc.)
        if (e.response)
            return { type: "http", status: e.response.status, url: e.config?.url, message: `HTTP ${e.response.status}`, };

        // Errore Axios ma senza response
        return { type: "unknown", url: e.config?.url, message: e.message, };
    }

    // Errore non Axios
    return { type: "unknown", message: String(err), };
}

/**
 * Funzione che stampa a console gli errori axios
 * @param err NormalizedHttpError, errore axios normalizzato
 * @param value any, valore da stampare in console
 */
function PrintAxiosError(err: NormalizedHttpError, errValue: ErrorValue): null {
    switch (err.type) {
        case "http":
            if (err.status === 404) {
                console.warn(`[${errValue.class}] - ${errValue.method}  ${errValue.value} not found (404)`);
                return null;
            }
            console.warn(`[${errValue.class}] HTTP  - ${errValue.method}  ${err.status} fetching ${errValue.value}`);
            return null;

        case "network":
            console.warn(`[${errValue.class}]  - ${errValue.method}  Network error fetching ${errValue.value}`);
            return null;

        case "timeout":
            console.warn(`[${errValue.class}]  - ${errValue.method}  Timeout fetching ${errValue.value}`);
            return null;

        default:
            console.warn(`[${errValue.class}]  - ${errValue.method}  Unknown error fetching ${errValue.value}`);
            return null;
    }
}

/**
 * Funzione per normalizzare e stampare in console gli errori axios
 * @param err unknown, l'errore axios
 * @param errValue ErrorValue, oggetto custom contenente le informazioni dell'errore
 */
export function NormalizeAndPrintError(err: unknown, errValue: ErrorValue): null {
    const normalized = normalizeAxiosError(err);
    return PrintAxiosError(normalized, errValue);
}