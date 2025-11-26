import './utility.ts';

/**
 * base: number
 * Si tratta del delay in ms di base
 * 
 * factor: number
 * l'esponente a cui verrà elevata la potenza per calcolare il backoffStrategy.
 */
const base = 100;
const factor = 2;

/**
 * Funzione che, dato il numero di tentativo (attempt), 
 * restituisce quanto tempo (in ms) aspettare prima del prossimo tentativo.
 * mappa attempt -> delayMs.
 * 
 * Strategia "Fixed":
 * const fixed: BackoffStrategy = (_attempt) => 200; // sempre 200ms
 * 
 * Strategia "Linear":
 * const linear: BackoffStrategy = (attempt) => 100 * attempt; // 100, 200, 300, ...
 * 
 * Strategia "Exponential":
 * const exponential: BackoffStrategy = (attempt) => base * Math.pow(factor, attempt - 1);
 */
type BackoffStrategy = (attempt: number) => number;

/**
 * 
 * @param attempt
 * argomento di tipo number su cui si vuole calcolare l'esponenziale.
 * 
 * @returns 
 * Ritorna il numero esponenziale calcolato dalla formula 
 * base * Math.pow(factor, attempt - 1)
 */
const exponential: BackoffStrategy = (attempt: number) => base * Math.pow(factor, attempt - 1);
