/**
* services/PokemonService
* Esempio di service di business logic che usa repository.
* Il service può decidere politiche di invalidazione, fallback su cache scaduta, ecc.
*/
import { apiClient } from "@/lib/http/apiClient";
import { PokemonRepository } from "@/repositories/pokemonRepository";

/**
 * Servizio per il recupero dei dati dalle generazioni
 */
export class PokemonService {
    private _repo = new PokemonRepository(this.client);

    constructor(private client = apiClient) { }

}