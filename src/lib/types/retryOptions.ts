import type { AxiosError } from "axios";

/**
 * Opzioni rilevanti del retry:
 *
 * maxAttempts: number
 * Numero totale di tentativi inclusa la prima esecuzione. 
 * Se maxAttempts = 3, la funzione prova massimo 3 volte.
 * 
 * baseDelayMs: number
 * Valore di base per calcolare i delay 
 * (usato dall’exponential backoff e come unità per altre strategy).
 * 
 * factor: number
 * Fattore moltiplicativo per backoff esponenziale. 
 * Default comune 2 (raddoppio).
 * 
 * maxDelayMs: number
 * Massimo ritardo consentito per un singolo backoff. 
 * Protegge da attese troppo grandi.
 * 
 * backoffStrategy: BackoffStrategy
 * Alternativa di configurazione: fornisci direttamente la funzione di backoff 
 * (puoi ignorare baseDelayMs e factor se fornisci questa).
 * (vedi sezione backoffStrategy in ./retry)
 * 
 * jitter: 'none' | 'full' | 'equal' | 'decorrelated'
 * Tipo di randomizzazione da applicare al delay per evitare "thundering herd". 
 * (Vedi sezione jitter.)
 * 
 * shouldRetry: (err, attempt) => boolean | Promise<boolean>
 * Funzione che decide, dato l’errore e il tentativo corrente, se ritentare. 
 * Qui si implementano regole come "retry solo su 5xx o network error" 
 * oppure "non retry su 400".
 * 
 * onRetry: (err, attempt, delayMs) => void | Promise<void>
 * Callback eseguita prima del sleep, utile per logging o metriche.
 * 
 * timeoutPerAttemptMs?: number
 * Timeout per ogni singolo tentativo: 
 * se un tentativo non risponde entro questo tempo, 
 * viene abortito e considerato fallimento.
 * 
 * signal?: AbortSignal
 * Permette la cancellazione esterna dell’intera operazione retry (es. utente annulla).
 * 
 * maxTotalTimeMs?: number (opzionale)
 * Tempo complessivo massimo consentito per tutta l’operazione, 
 * dopo il quale si fallisce a prescindere dagli attempt residui.
 */
export interface RetryOptions<T = unknown> {
  retries?: number;
  backoffBaseMs?: number;
  maxBackoffMs?: number;
  factor?: number;
  jitter?: 'none' | 'full' | 'decorrelated';
  shouldRetry?: (err: any, attempt: number) => boolean | Promise<boolean>;
  onRetry?: (err: AxiosError, attempt?: number, delayMs?: number) => boolean;
  timeoutPerAttemptMs?: number;
}