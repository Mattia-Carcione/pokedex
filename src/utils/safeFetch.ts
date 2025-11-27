import { ExtendedRequestConfig } from "@/lib/types/HttpTypes";
import { AxiosInstance } from "axios";

/**
 * funzione generica che tenta due URL: prima url, poi fallback
 * @param client istanza di axios
 * @param url url primario
 * @param fallback url di fallback se il primo url fallisce
 * @param cacheTTL ms opzionale per salvare TTL nel cache layer
 * @returns Promise<T>
 */
export async function fetchWithFallback<T>(
    client: AxiosInstance,
    url: string,
    fallback: string,
    cacheTTL?: number
): Promise<T> {
    try {
        const resp = await client.get(url, { cacheTTL } as any);
        return resp.data as T;
    } catch (err) {
        try {
            const respFallback = await client.get(fallback, { cacheTTL } as ExtendedRequestConfig);
            return respFallback.data as T;
        } catch (err2) {
            throw err2;
        }
    }
}
