import { NamedApi } from "@/types/pokeApi";
import { replaceStringUrl } from "./stringHelper";
import { fetchWithFallback } from "./safeFetch";
import { AxiosInstance } from "axios";
import { ExtendedRequestConfig } from "@/lib/types/axiosExtendedTypes";
import { NormalizeAndPrintError } from "@/lib/utils/manageError";

/**
 * Funzione helper che ritorna promise in parallelo con fetch fallback
 * @function fetchWithFallback
 * @param data (NamedApi[]) - array di dati pokemon
 * @param cacheTTL ms opzionale per salvare TTL nel cache layer
 */
export async function PromiseAll<T>(client: AxiosInstance, data: NamedApi[], cacheTTL: number, urlSpeciesReplace: boolean = false): Promise<T[] | null> {
    try {
        return await Promise.all(data.map(async (pkm) => {
            if (!urlSpeciesReplace)
                pkm.url = pkm.url.replace("-species", "");
            const fallbackUrl = replaceStringUrl(pkm.url, pkm.name);
            return await fetchWithFallback<T>(client, pkm.url, fallbackUrl, cacheTTL);
        }));
    } catch (err) {
        console.warn(`PromiseAll Error. ${err}`);
        return null;
    }
}

export async function PromiseAllAsync<T>(client: AxiosInstance, data: NamedApi[], cacheTTL: number): Promise<Awaited<T>[]> {
    const promises: Promise<T | null>[] = data.map(async (entry) => {
        try {
            const resp = await client.get<T>(
                entry.url,
                { cacheTTL } as ExtendedRequestConfig
            );
            return resp.data;
        } catch (err) {
            NormalizeAndPrintError(err, {
                method: "get",
                function: "PromiseAllAsync",
                class: "PromiseAll.ts",
                value: entry.url
            });
            return null;
        }
    });

    return await Promise.all(promises);
}