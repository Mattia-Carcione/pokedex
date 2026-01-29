/**
 * Interfaccia per una cache generica.
 */
export interface ICache<T> {
  /**
   * Recupera un valore dalla cache.
   * @param key - La chiave del valore da recuperare.
   * @returns Il valore associato alla chiave, o null se non esiste.
   */
  get(key: string): T | null;
  /**
   * Imposta un valore nella cache con una chiave specifica e un tempo di vita opzionale.
   * @param key - La chiave del valore da impostare.
   * @param value - Il valore da memorizzare nella cache.
   * @param ttlMs - Tempo di vita in millisecondi (opzionale).
   */
  set(key: string, value: T, ttlMs?: number): void;
  /**
   * Verifica se una chiave esiste nella cache.
   * @param key - La chiave da verificare.
   * @returns true se la chiave esiste, false altrimenti.
   */
  has(key: string): boolean;
  /**
   * Elimina un valore dalla cache.
   * @param key - La chiave del valore da eliminare.
   */
  delete(key: string): void;
  /**
   * Pulisce tutti i valori dalla cache.
   */
  clear(): void;
  /**
   * Genera una chiave univoca basata su classe, metodo e endpoint
   * @param className Nome della classe (repository o servizio)
   * @param method Nome del metodo
   * @param endpoint Endpoint o parametro unico
   */
  generateKey(className: string, method: string, endpoint: string): string;
}