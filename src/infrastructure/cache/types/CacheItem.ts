import { LightweightResponse } from "@/infrastructure/http/types/LightweightResponse";

/**
 * Interfaccia per l'elemento completo memorizzato in IndexedDB.
 */
export interface CachedItem<T = any> {
    key: string; // La chiave di cache, usata come keyPath
    response: LightweightResponse<T>;
    expiry: number; // Timestamp di scadenza (Date.now() + CACHE_LIFETIME_MS)
    cachedAt: number;
}