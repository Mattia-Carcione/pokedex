/**
* repositories/GenerationRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { Generation } from "@/types/pokemon/generation";
import { apiClient } from "../lib/http/apiClient";
import { ListApi, NamedApi } from "@/types/pokeApi";
import { ExtendedRequestConfig } from "@/lib/types/HttpTypes";
import { NormalizeAndPrintError } from "@/lib/utils/axiosError";

/**
 * Classe che rappresenta il repository per le generazioni
 */
export class GenerationRepository {
    private BASE_URL = 'https://pokeapi.co/api/v2/generation/';
    constructor(private client = apiClient) { }
    /**
     * Recupera i dati di una generazione (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async Get(id: number, cacheTTL?: number): Promise<Generation | null> {
        try {
            const pokeApi = await this.GetPokeApi(cacheTTL);
            if (!pokeApi) {
                console.warn(`[Get] Failed to fetch generation list`);
                return null;
            }
            const entry = this.MatchEntry(pokeApi.results, id);
            if (!entry) {
                console.warn(`[Get] Generation ${id} not found in PokeAPI list`);
                return null;
            }
            const resp = await this.client.get<Generation>(entry.url, { cacheTTL } as ExtendedRequestConfig);
            return resp.data;
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", value: `Gen ${id}`, class: 'GenerationRepository', function: 'Get' });
        }
    }

    /**
     * Recupera i dati di ogni generazione (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAll(cacheTTL?: number): Promise<Generation[] | null> {
        try {
            const pokeApi = await this.GetPokeApi(cacheTTL);
            if (!pokeApi) {
                console.warn(`[Get] Failed to fetch generation list`);
                return null;
            }
            return await Promise.all(pokeApi.results.map(async (x) => {
                const resp = await this.client.get<Generation>(x.url, {
                    // passiamo opzioni di caching custom che il cache layer leggerà
                    cacheTTL,
                } as ExtendedRequestConfig);
                return resp.data;
            }));
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", function: 'GetAll', class: 'GenerationRepository' });
        }
    }

    /**
     * Recupera la lista delle generazioni (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    private async GetPokeApi(cacheTTL?: number): Promise<ListApi | null> {
        try {
            const resp = await this.client.get<ListApi>(this.BASE_URL, {
                // passiamo opzioni di caching custom che il cache layer leggerà
                cacheTTL,
            } as ExtendedRequestConfig);
            return resp.data;
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", function: 'GetPokeApi', class: 'GenerationRepository' });
        }
    }

    /**
     * Funzione che restituisce il valore con l'url desiderato.
     * @param data NamedApi[]
     * @param value any, valore da confrontare
     * @returns 
     */
    private MatchEntry(data: NamedApi[], value: any) {
        return data.find(r => {
                const match = r.url.match(/\/generation\/(\d+)\/$/);
                return match && match[1] === value.toString();
            });
    }
}