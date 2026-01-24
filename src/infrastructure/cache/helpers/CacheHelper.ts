import { Result } from "@/core/domain/entities/Result";
import { CacheMap } from "../types/CacheItem";

/**
 * Controlla la cache in memory, altrimenti esegue la fetch e aggiorna la cache.
 * @param key chiave univoca per la cache
 * @param cache oggetto cache in memory (dal store)
 * @param fetcher funzione che ritorna la response della fetch
 * @param ttl tempo di vita della cache in ms
 */
export async function fetchWithMemoryCache<T>(
  key: string,
  cache: CacheMap<T>,
  fetcher: () => Promise<Result<T, Error>>,
  ttl = 3600_000 // default: 1h
): Promise<Result<T, Error>> {
  const now = Date.now();

  if (cache[key] && cache[key].expiry > now)
    return { success: true, data: cache[key].response.data as T, error: null };

  const response = await fetcher();

  if (response.success && response.data)
    cache[key] = { 
      key, 
      response: {
        data: response.data,
        status: 200,
        statusText: "OK",
        headers: {},
        config: { url: key }
      },
      cachedAt: now,
      expiry: now + ttl,
    };

  return response;
}
