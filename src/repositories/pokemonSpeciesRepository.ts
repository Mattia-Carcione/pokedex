/**
* repositories/PokemonSpeciesRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { PokemonSpecies } from "@/types/pokemon/pokemonSpecies";
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { GenerationRepository } from "./generationRepository";
import { ExtendedRequestConfig } from "@/lib/types/axiosExtendedTypes";
import { NormalizeAndPrintError } from "@/lib/utils/manageError";
import { PromiseAll } from "@/utils/promiseAll";

/**
 * Classe che rappresenta il repository per la specie dei Pokémon
 */
export class PokemonSpeciesRepository {
    private BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species/';
    private _generationRepository = new GenerationRepository(this.client);
    constructor(private client = pokeApiClient) { }
    /**
    * Recupera una generazione (usa GET -> soggetto a caching nel client)
    * @param cacheTTL ms opzionale per salvare TTL nel cache layer
    */
    async Get(id: number, cacheTTL?: number): Promise<PokemonSpecies> {
        try {
            const url = this.BASE_URL + id + '/';
            const resp = await this.client.get<PokemonSpecies>(url, {
                // passiamo opzioni di caching custom che il cache layer leggerà
                cacheTTL,
            } as ExtendedRequestConfig);
            return resp.data;
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", value: `Pokemon species ${id}`, class: 'PokemonSpeciesRepository', function: 'Get' });
        }
    }

    /**
     * Recupera i dati di tutte le specie Pokémon (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAll(cacheTTL?: number): Promise<PokemonSpecies[]> {
        try {
            const pokeApi = await this._generationRepository.GetAll(cacheTTL);
            if (!pokeApi) {
                console.warn(`[Get] Failed to fetch pokemon species list`);
                return null;
            }
            return await Promise.all(pokeApi.map(async (e) => {
                return await PromiseAll<PokemonSpecies>(this.client, e.pokemon_species, cacheTTL, true);
            })).then((data) => data.flat());
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", class: 'PokemonSpeciesRepository', function: 'GetAll' });
        }
    }

    /**
     * Recupera i dati di tutti della specie Pokémon (usa GET -> soggetto a caching nel client)
     * @param id (number) - Ritorna i dati di tutte le specie pokemon di una generazione
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAllByGen(id: number, cacheTTL?: number): Promise<PokemonSpecies[] | null> {
        try {
            const pokeApi = await this._generationRepository.GetAll(cacheTTL);
            if (!pokeApi) {
                console.warn(`[Get] GetAllByGen ${id} not found.`);
                return null;
            }
            const pkm = pokeApi.find(x => x.id == id);
            if (!pkm) {
                console.warn(`[Get] GetAllByGen ${id} not found.`);
                return null;
            }
            const resp = await PromiseAll<PokemonSpecies>(this.client, pkm.pokemon_species, cacheTTL, true);
            return resp.flat();
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", function: 'GetAllByGen', class: 'PokemonSpecies', value: `Pokémon species of gen ${id}` });
        }
    }
}