/**
* services/PokemonService
* Esempio di service di business logic che usa repository.
* Il service può decidere politiche di invalidazione, fallback su cache scaduta, ecc.
*/
import { apiClient } from "@/lib/http/apiClient";
import { ExtendedRequestConfig } from "@/lib/types/HttpTypes";
import { PokemonRepository } from "@/repositories/pokemonRepository";
import { CardPokemon } from "@/types/components/cardPokemon";
import { ListApi } from "@/types/pokeApi";
import { Mapper } from "@/utils/mapper";

/**
 * Servizio per il recupero dei dati dalle generazioni
 * @function CreateCardPokemon (id: number, cacheTTL?: number): Promise<CardPokemon | null> - Restituisce la card del pokémon
 * @function CreateAllCardByGen (id: number, cacheTTL?: number): Promise<CardPokemon[] | null> - Restituisce la card dei pokémon di una generazione specifica
 */
export class PokemonService {
    private _repo = new PokemonRepository(this.client);
    private URL = 'https://pokeapi.co/api/v2/pokemon/';
    constructor(private client = apiClient) { }

    /**
     * Funzione per la creazione della card del Pokémon
     * @param id (number) - identificativo del Pokémon
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async CreateCardPokemon(id: number, cacheTTL?: number): Promise<CardPokemon | null> {
        const resp = await this._repo.Get(id, cacheTTL);
        if (!resp) return null;
        const count = await this.GetCountPokemonList(cacheTTL);
        return Mapper.CardPokemonMapper(resp, count);
    }

    /**
     * Funzione per la creazione delle card dei Pokémon di una generazione specifica
     * @param id (number) - identificativo della generazione
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async CreateAllCardByGen(id: number, cacheTTL?: number): Promise<CardPokemon[] | null> {
        const resp = await this._repo.GetAllByGen(id, cacheTTL);
        if (!resp) return null;
        const data = resp.sort((a: any, b: any) => a.id - b.id);
        const count = await this.GetCountPokemonList(cacheTTL);
        return data.map((x) => Mapper.CardPokemonMapper(x, count));
    }

    /**
     * Funzione per il recupero del numero totale dei Pokémon attuali
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    private async GetCountPokemonList(cacheTTL?: number): Promise<number> {
        const { data } = await this.client.get<ListApi>(this.URL, {
            // passiamo opzioni di caching custom che il cache layer leggerà
            cacheTTL,
        } as ExtendedRequestConfig);
        return data.count;
    }
}