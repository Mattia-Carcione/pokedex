/**
* repositories/pokeApiRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { apiClient } from "../lib/http/apiClient";
import { GenerationRepository } from "./generationRepository";
import { PokemonRepository } from "./pokemonRepository";
import { PokemonSpeciesRepository } from "./pokemonSpeciesRepository";

/**
 * Classe che rappresenta il repository per la pokeApi
 */
export class PokeApiRepository {
    private _pkmRepository = new PokemonRepository(this.client);
    private _pkmSpeciesRepository = new PokemonSpeciesRepository(this.client);
    private _genRepository = new GenerationRepository(this.client);
    constructor(private client = apiClient) { }

    /**
     * Metodo che recupera tutti i dati e li salva in cache.
     * Se i dati sono già presenti in cache, recupera quelli.
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer 
     */
    async GetAndStoreData(cacheTTL?: number): Promise<void | null> {
        try {
            await this._genRepository.GetAll(cacheTTL);
            await this._pkmRepository.GetAll(cacheTTL);
            await this._pkmSpeciesRepository.GetAll(cacheTTL);
        } catch (err) {
            console.warn(`Error GetAndStoreData fetching data. \n${err}`);
            return null;
        }
    }
}