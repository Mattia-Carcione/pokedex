/**
 * Funzione che, dato il numero di tentativo (attempt), 
 * restituisce quanto tempo (in ms) aspettare prima del prossimo tentativo.
 * mappa attempt -> delayMs.
 * 
 * Strategia "Fixed":
 * const fixed: FixedBackoffStrategy = (_attempt) => 200; // sempre 200ms
 * 
 * Strategia "Linear":
 * const linear: LinearBackoffStrategy = (attempt) => 100 * attempt; // 100, 200, 300, ...
 * 
 * Strategia "Exponential":
 * const exponential: ExponentialBackoffStrategy = (attempt) => base * Math.pow(factor, attempt - 1);
 */
export type FixedBackoffStrategy = () => number;

/**
 * Funzione che, dato il numero di tentativo (attempt), 
 * restituisce quanto tempo (in ms) aspettare prima del prossimo tentativo.
 * mappa attempt -> delayMs.
 * 
 * Strategia "Fixed":
 * const fixed: FixedBackoffStrategy = (_attempt) => 200; // sempre 200ms
 * 
 * Strategia "Linear":
 * const linear: LinearBackoffStrategy = (attempt) => 100 * attempt; // 100, 200, 300, ...
 * 
 * Strategia "Exponential":
 * const exponential: ExponentialBackoffStrategy = (attempt) => base * Math.pow(factor, attempt - 1);
 */
export type LinearBackoffStrategy = (attempt: number) => number;

/**
 * Funzione che, dato il numero di tentativo (attempt), 
 * restituisce quanto tempo (in ms) aspettare prima del prossimo tentativo.
 * mappa attempt -> delayMs.
 * 
 * Strategia "Fixed":
 * const fixed: FixedBackoffStrategy = (_attempt) => 200; // sempre 200ms
 * 
 * Strategia "Linear":
 * const linear: LinearBackoffStrategy = (attempt) => 100 * attempt; // 100, 200, 300, ...
 * 
 * Strategia "Exponential":
 * const exponential: ExponentialBackoffStrategy = (attempt) => base * Math.pow(factor, attempt - 1);
 */
export type ExponentialBackoffStrategy = (attempt: number, base:number, factor: number) => number;