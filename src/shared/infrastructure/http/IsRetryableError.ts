import axios, { AxiosError } from "axios";

/**
 * Funzione helper che determina se un errore e ritentabile o meno.
 * @param err (AxiosError) - Oggetto di errore AxiosError
 */
export const IsRetryableError = (err: AxiosError): boolean => {
    // Codici di stato HTTP considerati transitori
    const transientStatusCodes = [429, 500, 503, 504];

    // Se c'è una risposta e il codice è transitorio
    if (err.response && transientStatusCodes.includes(err.response.status)) {
        console.log(`[Retry Logic] Status ${err.response.status} found. Retrying.`);
        return true;
    }

    // Se non c'è risposta (es. network err, timeout, DNS err) e non è una cancellazione
    if (!err.response && !axios.isCancel(err)) {
        console.log("[Retry Logic] No response error (Network/Timeout). Retrying.");
        return true;
    }

    // Errore non ritentabile (es. 400 Bad Request, 404 Not Found)
    return false;
}