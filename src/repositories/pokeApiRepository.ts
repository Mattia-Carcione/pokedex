/**
* repositories/pokeApiRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { NormalizeAndPrintError } from "@/lib/utils/manageError";
import { Names, PokeApi } from "../types/pokeApi";
import { Version, VersionGroup } from "../types/pokemon/versionGroup";
import { ExtendedRequestConfig } from "@/lib/types/axiosExtendedTypes";
import { PromiseAllAsync } from "@/utils/promiseAll";

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

    private async GetVersionList(cacheTTL: number): Promise<PokeApi | null> {
        try {
            const pokeApi = await this.client.get<PokeApi>(
                this.BASE_URL,
                { cacheTTL } as ExtendedRequestConfig
            );
            const data = pokeApi?.data ?? null;
            return data;
        } catch (err) {
            NormalizeAndPrintError(err, {
                method: "get",
                function: "GetVersionList",
                class: "PokeApiRepository",
                value: this.BASE_URL
            });
        }
    }

    /**
     * Recupera tutti i version-group con caching TTL opzionale.
     * Implementazione scalabile, robusta e parallela con Promise.all.
     *
     * @param cacheTTL number - tempo di caching custom
     */
    async getVersionGroups(cacheTTL: number): Promise<{vg: VersionGroup[], names: Version[] } | []> {
        try {
            const data = await this.GetVersionList(cacheTTL);
            if (!data) return [];

            const vg = await PromiseAllAsync<VersionGroup>(this.client, data.results, cacheTTL);
            const vgMap = vg.map(x => x.versions.map(e => e));
            const vDetail = await PromiseAllAsync<Version>(this.client, vgMap.flat(), cacheTTL);
            return {
                vg: vg.filter((v): v is VersionGroup => v !== null),
                names: vDetail
            };

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