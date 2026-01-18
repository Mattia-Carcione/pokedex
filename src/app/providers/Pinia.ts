// src/app/providers/pinia.ts
import { createPinia } from 'pinia';

// Creazione dell'istanza Pinia
/**
 * Istanza globale di Pinia per la gestione dello stato.
 */
const pinia = createPinia();

/**
 * [Inferenza]: Qui puoi aggiungere plugin globali.
 * Ad esempio, un plugin per gestire il ripristino dello stato dal LocalStorage
 * o un logger per il debugging.
 */
// pinia.use(somePiniaPlugin);
export default pinia;
