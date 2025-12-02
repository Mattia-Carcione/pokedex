/**
* services/PokemonSpeciesService
* Esempio di service di business logic che usa repository.
* Il service può decidere politiche di invalidazione, fallback su cache scaduta, ecc.
*/
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { PokemonSpeciesRepository } from "@/repositories/pokemonSpeciesRepository";

/**
 * Servizio per il recupero dei dati dalle generazioni
 */
export class PokemonSpeciesService {
    private _repo = new PokemonSpeciesRepository(this.client);

    constructor(private client = pokeApiClient) { }

}