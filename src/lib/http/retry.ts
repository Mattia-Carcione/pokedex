import type { AxiosError, AxiosInstance } from 'axios';
import type { ExponentialBackoffStrategy } from '../types/backoffStrategy';
import type { RetryOptions } from '../types/retryOptions';
import { applyJitter } from '../utils/jitter';
import { sleep } from '../utils/sleep';

/**
 * @param attempt
 * argomento di tipo number su cui si vuole calcolare l'esponenziale.
 * 
 * @returns 
 * Ritorna il numero esponenziale calcolato dalla formula 
 * base * Math.pow(factor, attempt - 1)
 */
const exponential: ExponentialBackoffStrategy = (attempt: number, base: number, factor: number) => base * Math.pow(factor, attempt - 1);

/**
 * Opzioni default di tipo RetryOptions
 */
const DEFAULTS: Required<RetryOptions> = {
  retries: 3,
  backoffBaseMs: 200, // 200ms
  maxBackoffMs: 5000,
  jitter: 'full',
  factor: 2,
  shouldRetry: () => true,
  onRetry: (err: AxiosError) => {
    // default: retry su errori di rete o 5xx
    if (!err || !err.config) return false;
    if (err.code === "ECONNABORTED") return true; // timeout
    const status = err.response?.status;
    if (!status) return true; // network error
    return status >= 500 && status < 600;
  },
  timeoutPerAttemptMs: 5000,
};

/**
 * Funzione per eseguire nuovi tentativi di una funzione che fallisce.
 * 
 * @param client AxiosInstance -
 * Funzione da ritentare
 * @param opts RetryOptions -
 * Vedi ../retryOptions
 * @returns Promise<void>
 * La funzione da eseguire fino al max di tentativi.
 */
export async function retry(client: AxiosInstance, opts: RetryOptions = {}): Promise<void> {
  const cfg = { ...DEFAULTS, ...opts };

  let prevDelay: number | undefined;
  client.interceptors.response.use(
    (r) => r,
    async (error) => {
      try {
        if (!error.config) return Promise.reject(error);

        // attach retry count state
        const retryCount = (error.config as any).__retryCount || 0;

        if (retryCount >= cfg.retries) return Promise.reject(error);

        if (!cfg.onRetry(error)) return Promise.reject(error);

        // compute backoff
        const expBackoff = exponential(cfg.retries, cfg.backoffBaseMs, cfg.factor);
        const delay = applyJitter(expBackoff, prevDelay, cfg.jitter);
        prevDelay = delay;

        // increment retry counter on the config copy
        (error.config as any).__retryCount = retryCount + 1;

        await sleep(delay);

        // re-invocare la richiesta
        return client.request(error.config);
      } catch (inner) {
        return Promise.reject(inner);
      }
    }
  );
}