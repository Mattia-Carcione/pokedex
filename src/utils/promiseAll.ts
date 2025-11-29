import { NamedApi } from "@/types/pokeApi";
import { replaceStringUrl } from "./stringHelper";
import { fetchWithFallback } from "./safeFetch";

/**
 * Funzione helper che ritorna promise in parallelo con fetch fallback
 * @function fetchWithFallback
 * @param data (NamedApi[]) - array di dati pokemon
 * @param cacheTTL ms opzionale per salvare TTL nel cache layer
 */
export async function PromiseAll<T>(data: NamedApi[], cacheTTL: number, urlSpeciesReplace: boolean = false): Promise<T[] | null> {
    try {
        return await Promise.all(data.map(async (pkm) => {
            if (!urlSpeciesReplace)
                pkm.url = pkm.url.replace("-species", "");
            const fallbackUrl = replaceStringUrl(pkm.url, pkm.name);
            return await fetchWithFallback<T>(this.client, pkm.url, fallbackUrl, cacheTTL);
        }));
    } catch (err) {
        console.warn(`PromiseAll Error. ${err}`);
        return null;
    }
}