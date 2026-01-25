import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Funzione per verificare e completare un endpoint con la BASE_URI se necessario.
 * @param endpoint L'endpoint da verificare.
 * @param BASE_URI La base URI da aggiungere se l'endpoint non è completo.
 * @param className Il nome della classe che utilizza questa funzione (per il logging).
 * @param logger L'istanza del logger per registrare i messaggi.
 * @returns L'endpoint completo.
 */
export function checkEndpoint(endpoint: string, BASE_URI: string, className: string, logger?: ILogger): string {
    const startsWithHttp = endpoint.startsWith("http");

    if (!startsWithHttp) {
        logger?.warn(`${className} - Endpoint non completo fornito. Originale: "${endpoint}", aggiornato con BASE_URI: "${BASE_URI + endpoint}".`);
        endpoint = BASE_URI + endpoint;
    }
    return endpoint;
}