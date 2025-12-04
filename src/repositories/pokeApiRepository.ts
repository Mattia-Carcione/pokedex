/**
* repositories/pokeApiRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { NormalizeAndPrintError } from "@/lib/utils/manageError";
import { PokeApi } from "../types/pokeApi";
import { VersionGroup } from "../types/pokemon/versionGroup";
import { ExtendedRequestConfig } from "@/lib/types/axiosExtendedTypes";

/**
* Repository per la PokeAPI.
* Recupera:
*  1. La lista dei version-group
*  2. Tutti i dettagli in parallelo tramite Promise.all
*/
export class PokeApiRepository {
    private BASE_URL = "https://pokeapi.co/api/v2/version-group/?limit=100000";

    /**
     * Costruttore del repository
     * @param client (AxiosInstance) axios instance
     */
    constructor(private client = pokeApiClient) { }

    /**
     * Recupera tutti i version-group con caching TTL opzionale.
     * Implementazione scalabile, robusta e parallela con Promise.all.
     *
     * @param cacheTTL number - tempo di caching custom
     */
    async getVersionGroups(cacheTTL: number): Promise<VersionGroup[] | null> {
        try {
            const pokeApi = await this.client.get<PokeApi>(
                this.BASE_URL,
                { cacheTTL } as ExtendedRequestConfig
            );
            const data = pokeApi?.data ?? null;
            if (!data) return [];

            const promises: Promise<VersionGroup | null>[] = data.results.map(async (entry) => {
                try {
                    const vg = await this.client.get<VersionGroup>(
                        entry.url,
                        { cacheTTL } as ExtendedRequestConfig
                    );
                    return vg.data;
                } catch (err) {
                    NormalizeAndPrintError(err, {
                        method: "get",
                        function: "GetPokeApi",
                        class: "PokeApiRepository",
                        value: entry.url
                    });
                    return null;
                }
            });

            const fetched = await Promise.all(promises);

            return fetched.filter((v): v is VersionGroup => v !== null);

        } catch (err) {
            return NormalizeAndPrintError(err, {
                method: "get",
                function: "GetPokeApi",
                class: "PokeApiRepository",
                value: this.BASE_URL
            });
        }
    }

}