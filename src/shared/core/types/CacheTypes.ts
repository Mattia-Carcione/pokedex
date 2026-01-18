/**
 * Interfaccia per l'oggetto risposta leggera salvato in IndexedDB.
 * Deve contenere solo dati serializzabili (senza riferimenti ciclici o complessi).
 */
export interface LightweightAxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: { url?: string; method?: string };
}

/**
 * Interfaccia per l'elemento completo memorizzato in IndexedDB.
 */
export interface CachedItem<T = any> {
    key: string; // La chiave di cache, usata come keyPath
    response: LightweightAxiosResponse<T>;
    expiry: number; // Timestamp di scadenza (Date.now() + CACHE_LIFETIME_MS)
    cachedAt: number;
}

/**
* types/cache
* Tipi condivisi per la cache
*/
export type CachedResponse = {
    /** payload originale di axios response.data */
    data: any;
    /** headers ricevuti */
    headers: Record<string, any>;
    /** status code (es. 200) */
    status: number;
    /** timestamp ms di quando è stata salvata */
    savedAt: number;
    /** opzionale expiresAt ms per invalidazione */
    expiresAt: number | null;
};