/**
* services/GenerationService
* Esempio di service di business logic che usa repository.
* Il service può decidere politiche di invalidazione, fallback su cache scaduta, ecc.
*/
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { GenerationRepository } from "../repositories/generationRepository";
import { Generation } from "@/types/pokemon/generation";
import { Mapper } from "@/utils/mapper";
import { NavGen } from "@/types/components/navGen";

/**
 * Servizio per il recupero dei dati dalle generazioni
 */
export class GenerationService {
    private _repo = new GenerationRepository(this.client);

    constructor(private client = pokeApiClient) { }

    async Fetch(id: number, cacheTTL?: number): Promise<Generation | null> {
        return await this._repo.Get(id, cacheTTL);
    }

    /**
     * Recupera tutte le generazioni e le restituisce in un oggetto per la navbar
     * @param cacheTTL 
     * @returns 
     */
    async FetchAll(cacheTTL?: number): Promise<NavGen[] | null> {
        try {
            const data = await this._repo.GetAll(cacheTTL);
            return Mapper.NavbarMapper(data);
        } catch (err) {
            console.warn(`Error FetchAll GenerationService fetching data. \n${err}`);
            return null;
        }
    }
}