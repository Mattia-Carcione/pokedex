import { ICache } from "@/core/contracts/infrastructure/cache/ICache";

/**
 * Implementazione di una cache in memoria semplice.
 * Utilizza una Map per memorizzare i dati con supporto opzionale per TTL (time-to-live).
 */
export class InMemoryCache<T> implements ICache<T> {
  private store = new Map<string, { value: T; expiresAt?: number }>();
  private defaultTTL = 3600_000;

  /** 
   * Recupera un valore dalla cache. Ritorna null se non esiste o è scaduto. 
   * @param key La chiave di cache.
   * @return Il valore memorizzato o null se non trovato/scaduto.
   */
  get(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  /**  * Memorizza un valore nella cache con una chiave opzionale e TTL.
   * @param key La chiave di cache.
   * @param value Il valore da memorizzare.
   * @param ttlMs Tempo in millisecondi dopo il quale il valore scade (opzionale).
   */
  set(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTTL);
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Controlla se una chiave esiste nella cache e non è scaduta.
   * @param key La chiave di cache.
   * @return true se la chiave esiste e non è scaduta, false altrimenti.
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Rimuove un elemento dalla cache.
   * @param key La chiave di cache.
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Pulisce tutti gli elementi dalla cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Genera una chiave univoca basata su classe, metodo e endpoint.
   * @param className Nome della classe (repository o servizio).
   * @param method Nome del metodo.
   * @param endpoint Endpoint o parametro unico.
   * @return La chiave generata.
   */
  generateKey(className: string, method: string, endpoint: string): string {
      return `${className}:${method}:${endpoint}`;
  }
}