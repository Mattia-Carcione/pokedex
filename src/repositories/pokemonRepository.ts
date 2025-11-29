/**
* repositories/PokemonRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { apiClient } from "../lib/http/apiClient";
import { GenerationRepository } from "./generationRepository";
import { Pokemon } from "@/types/pokemon/pokemon";
import { ExtendedRequestConfig } from "@/lib/types/HttpTypes";
import { NormalizeAndPrintError } from "@/lib/utils/axiosError";
import { PromiseAll } from "@/utils/promiseAll";

/**
 * Classe che rappresenta il repository per i Pokémon
 */
export class PokemonRepository {
    private BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
    private _generationRepository = new GenerationRepository(this.client);
    constructor(private client = apiClient) { }

    /**
    * Recupera una generazione (usa GET -> soggetto a caching nel client)
    * @param id identificativo del Pokémon
    * @param cacheTTL ms opzionale per salvare TTL nel cache layer
    */
    async Get(id: number, cacheTTL?: number): Promise<Pokemon> {
        try {
            const url = this.BASE_URL + id;
            const resp = await this.client.get<Pokemon>(url, {
                // passiamo opzioni di caching custom che il cache layer leggerà
                cacheTTL,
            } as ExtendedRequestConfig);
            return resp.data;
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", function: 'Get', class: 'PokemonRepository', value: `${id} Pokémon` });
        }
    }

    /**
     * Recupera i dati di tutti i Pokémon (usa GET -> soggetto a caching nel client)
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAll(cacheTTL?: number): Promise<Pokemon[]> {
        try {
            const pokeApi = await this._generationRepository.GetAll(cacheTTL);
            if (!pokeApi) {
                console.warn(`[Get] Generations not found.`);
                return null;
            }
            const resp = await Promise.all(pokeApi.map(async (e) => {
                return await PromiseAll<Pokemon>(e.pokemon_species, cacheTTL);
            }));
            return resp.flat();
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", function: 'GetAll', class: 'PokemonRepository' });
        }
    }

    /**
     * Recupera i dati di tutti i Pokémon (usa GET -> soggetto a caching nel client)
     * @param id (number) - Ritorna i dati di tutti i pokemon di una generazione
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async GetAllByGen(id: number, cacheTTL?: number): Promise<Pokemon[] | null> {
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
            const resp = await PromiseAll<Pokemon>(pkm.pokemon_species, cacheTTL);
            return resp.flat();
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", function: 'GetAllByGen', class: 'PokemonRepository', value: `Pokémon of gen ${id}` });
        }
    }
}