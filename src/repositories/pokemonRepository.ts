/**
* repositories/PokemonRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/

import { replaceStringUrl } from "@/utils/stringHelper";
import { apiClient } from "../lib/http/apiClient";
import { GenerationRepository } from "./generationRepository";
import { Pokemon } from "@/types/pokemon/pokemon";
import { fetchWithFallback } from "@/utils/safeFetch";
import { ExtendedRequestConfig } from "@/lib/types/HttpTypes";

/**
 * Classe che rappresenta il repository per i Pokémon
 */
export class PokemonRepository {
    private BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
    private _generationRepository = new GenerationRepository(this.client);
    constructor(private client = apiClient) { }
    /**
    * Recupera una generazione (usa GET -> soggetto a caching nel client)
    * @param cacheTTL ms opzionale per salvare TTL nel cache layer
    */
    async Get(id: number, cacheTTL?: number): Promise<Pokemon> {
        const url = this.BASE_URL + id;
        const resp = await this.client.get(url, {
            // passiamo opzioni di caching custom che il cache layer leggerà
            cacheTTL,
        } as ExtendedRequestConfig);
        return resp.data as Pokemon;
    }

    /**
     * Recupera i dati di tutti i Pokémon (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAll(cacheTTL?: number): Promise<Pokemon[]> {
        const pokeApi = await this._generationRepository.GetAll(cacheTTL);
        return await Promise.all(pokeApi.map(async (e) => {
            return await Promise.all(e.pokemon_species.map(async (pkm) => {
                const url = pkm.url.replace("-species", "");
                const fallbackUrl = replaceStringUrl(url, pkm.name);
                return await fetchWithFallback<Pokemon>(this.client, url, fallbackUrl, cacheTTL);
            }))
        })).then((data) => data.flat());
    }

    /**
     * Recupera i dati di tutti i Pokémon (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAllByGen(id: number, cacheTTL?: number): Promise<Pokemon[]> {
        const pokeApi = await this._generationRepository.GetAll(cacheTTL);
        const pkm = pokeApi.find(x => x.id === id);
        return await Promise.all(pkm.pokemon_species.map(async (e) => {
            const url = e.url.replace("-species", "");
            const fallbackUrl = replaceStringUrl(url, e.name);
            return await fetchWithFallback<Pokemon>(this.client, url, fallbackUrl, cacheTTL);
        }))
        .then((data) => data.flat());
    }
}