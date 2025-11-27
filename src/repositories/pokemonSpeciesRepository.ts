/**
* repositories/PokemonSpeciesRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { PokemonSpecies } from "@/types/pokemon/pokemonSpecies";
import { apiClient } from "../lib/http/apiClient";
import { GenerationRepository } from "./generationRepository";
import { ExtendedRequestConfig } from "@/lib/types/HttpTypes";

/**
 * Classe che rappresenta il repository per la specie dei Pokémon
 */
export class PokemonSpeciesRepository {
    private BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species/';
    private _generationRepository = new GenerationRepository(this.client);
    constructor(private client = apiClient) { }
    /**
    * Recupera una generazione (usa GET -> soggetto a caching nel client)
    * @param cacheTTL ms opzionale per salvare TTL nel cache layer
    */
    async Get(id: number, cacheTTL?: number): Promise<PokemonSpecies> {
        const url = this.BASE_URL + id;
        const resp = await this.client.get(url, {
            // passiamo opzioni di caching custom che il cache layer leggerà
            cacheTTL,
        } as ExtendedRequestConfig);
        return resp.data as PokemonSpecies;
    }

    /**
     * Recupera i dati di tutti i Pokémon (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAll(cacheTTL?: number): Promise<PokemonSpecies[]> {
        const pokeApi = await this._generationRepository.GetAll(cacheTTL);
        return await Promise.all(pokeApi.map(async (e) => {
            return await Promise.all(e.pokemon_species.map(async ({url}) => {
                const resp = await this.client.get(url, {
                    // passiamo opzioni di caching custom che il cache layer leggerà
                    cacheTTL,
                } as ExtendedRequestConfig);
                return resp.data as PokemonSpecies;
            }))
        })).then((data) => data.flat());
    }
}