import { RetryAxiosRequestConfig } from "@/shared/infrastructure/http/types/AxiosExtendedTypes";
import { ExponentialBackoffStrategy } from "@/shared/infrastructure/http/utils/backoffStrategy";

/**
 * Funzione per generare un numero casuale in un intervallo [min, max]
 * @param min minimo dell'intervallo
 * @param max massimo dell'intervallo
 */
const randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Backoff strategy di tipo exponential
 * @param attempt numero di retry
 * @param base la base della potenza
 * @param factor il fattore esponenziale della potenza
 * 
 * @returns Ritorna il numero esponenziale calcolato dalla formula 
 * base * Math.pow(factor, attempt - 1)
 */
const exponential: ExponentialBackoffStrategy = (attempt: number, base: number, factor: number) => base * Math.pow(factor, attempt - 1);


/**
 * 
 * La funzione applyJitter serve a introdurre casualità sui ritardi calcolati
 * per evitare che se molti utenti falliscono nello stesso istante,
 * venga rifatta la stessa richiesta di tutti gli utenti che hanno fallito
 * nello stesso istante.
 * 
 * @param jitter il tipo di jitter da calcolare
 * @param prevDelay il ritardo precendente.
 * @returns ritorna il numero di casualità calcolato sul ritardo.
 */
export function applyJitter(cfg: RetryAxiosRequestConfig, prevDelay: number = 1000): number {
    // 1. Calcolo del Backoff puro (D)
    const D_backoff = exponential(cfg.retry, cfg.retryDelay, 2);
    switch (cfg.jitter) {
        case 'decorrelated':
            const growthFactor = 3; // Fattore di crescita massima
            const minDelay = cfg.retryDelay;
            const maxDelay = prevDelay * growthFactor; // Es. se T_prev = 1500, maxDelay è 4500ms
            return randomRange(minDelay, maxDelay);

        case 'full':
            /**
             * Ritardo = random(0, calculatedDelay)
             * — si sceglie uniformemente un valore fra 0 e il delay calcolato. 
             * Molto efficace per disperdere tentativi.
             */
            return Math.floor(Math.random() * D_backoff);

        case 'equal':
            // 2. Calcolo del Equal Jitter (T_wait)
            const fixed_part = D_backoff / 2; // 2000ms
            // Casuale tra 0 e 2000ms
            const random_part = Math.floor(Math.random() * fixed_part);

            /**
             * Proposto per bilanciare attesa media e spike: 
             * delay = calculatedDelay / 2 + random(0, calculatedDelay / 2)
             * — media = 75% del delay calcolato, meno variabilità estrema rispetto al full jitter.
            */
            return fixed_part + random_part;

        default:
            /**
             * Ritardo = valore calcolato. Deterministico.
             */
            return cfg.retryDelay;
    }
}