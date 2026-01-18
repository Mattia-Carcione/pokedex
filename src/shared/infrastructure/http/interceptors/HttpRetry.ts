import { AxiosError, AxiosInstance } from "axios";
import { RetryAxiosRequestConfig } from "../types/AxiosExtendedTypes";
import { delay } from "@/shared/core/utils/helpers/Delay";
import { IsRetryableError } from "../IsRetryableError";
import { DEFAULT_OPTS } from "../config/AxiosConfig";
import { applyJitter } from "../utils/jitter";

/**
 * Funzione per la gestione degli errori e retry che utilizza l'interceptor di risposta di axios
 * @param client (AxiosInstance) Istanza di axsios.
 */
export async function Retry(client: AxiosInstance, opts: RetryAxiosRequestConfig = DEFAULT_OPTS): Promise<void> {

    let prevDelay: number | undefined;
    client.interceptors.response.use(
        (response) => response, // Se la risposta è positiva, la passiamo avanti
        async (error: AxiosError) => {
            // Castiamo l'oggetto config all'interfaccia estesa per TypeScript
            const config = { ...opts, ...error.config } as RetryAxiosRequestConfig;

            if(!error.config) return Promise.reject(error);
            
            // Verifichiamo che la configurazione del retry esista
            if (!config || config.retry === undefined)
                // Se manca la configurazione, rigettiamo l'errore immediatamente
                return Promise.reject(error);

            // 1. Inizializzazione del Contatore
            config.__retryCount = config.__retryCount || 0;

            // 2. Controllo Condizione di Arresto
            if (config.__retryCount >= config.retry) {
                console.error(`[Retry Logic] Tentativi esauriti (${config.retry}). Fallimento definitivo.`);
                return Promise.reject(error);
            }

            // 3. Controllo Ritentabilità dell'Errore
            if (!IsRetryableError(error)) {
                console.error("[Retry Logic] Errore non ritentabile (es. 404/400). Rigetto.");
                return Promise.reject(error);
            }

            // 4. Esecuzione del Retry
            // Incrementa il contatore
            config.__retryCount++;

            // ** IMPLEMENTAZIONE DEL FULL JITTER **
            // Genera un ritardo casuale tra 0 e il Backoff calcolato
            const jitterDelay = applyJitter(config, prevDelay);
            prevDelay = jitterDelay;

            // Attendi il tempo calcolato
            await delay(jitterDelay);

            // Ripeti la richiesta utilizzando la configurazione originale aggiornata
            // L'intercettore ritorna una Promise risolta dalla nuova chiamata API
            return client(config);
        }
    );
}