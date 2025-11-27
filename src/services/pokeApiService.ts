/**
* services/PokeApiService
* Esempio di service di business logic che usa repository.
* Il service può decidere politiche di invalidazione, fallback su cache scaduta, ecc.
*/
import { apiClient } from "@/lib/http/apiClient";
import { PokeApiRepository } from "../repositories/pokeApiRepository";

/**
 * Servizio per il recupero dei dati dalla pokeApi
 */
export class PokeApiService {
    private _repo = new PokeApiRepository(this.client);
    constructor(private client = apiClient) { }

    /**
    * Ottieni PokeApi con fallback: se la chiamata verso l'API fallisce, prova a leggere dalla cache direttamente
    */
    async FetchPokeApi(cacheTTL?: number): Promise<void> {
        return await this._repo.GetAndStoreData(cacheTTL);
    }
}