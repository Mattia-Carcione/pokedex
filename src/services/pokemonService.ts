/**
* services/PokemonService
* Esempio di service di business logic che usa repository.
* Il service può decidere politiche di invalidazione, fallback su cache scaduta, ecc.
*/
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { ExtendedRequestConfig } from "@/lib/types/axiosExtendedTypes";
import { NormalizeAndPrintError } from "@/lib/utils/manageError";
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
    protected _repo = new PokemonRepository(this.client);
    private URL = 'https://pokeapi.co/api/v2/pokemon/';
    constructor(protected client = pokeApiClient) { }

    /**
     * Funzione per la creazione della card del Pokémon
     * @param id (number) - identificativo del Pokémon
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async CreateCardPokemon(id: number, cacheTTL?: number): Promise<CardPokemon | null> {
        try {
            const resp = await this._repo.Get(id, cacheTTL);
            if (!resp) return null;
            const count = await this.GetCountPokemonList(cacheTTL);
            return Mapper.CardPokemonMapper(resp, count);
        } catch (err) {
            console.warn(`Error CreateCardPokemon PokemonRepository fetching data ${id}. \n${err}`);
            return null;
        }
    }

    /**
     * Funzione per la creazione delle card dei Pokémon di una generazione specifica
     * @param id (number) - identificativo della generazione
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async CreateAllCardByGen(id: number, cacheTTL?: number): Promise<CardPokemon[] | null> {
        try {
            const resp = await this._repo.GetAllByGen(id, cacheTTL);
            if (!resp) return null;
            const data = resp.sort((a: any, b: any) => a.id - b.id);
            const count = await this.GetCountPokemonList(cacheTTL);
            return data.map((x) => Mapper.CardPokemonMapper(x, count));
        } catch (err) {
            console.warn(`Error CreateAllCardByGen PokemonRepository fetching data ${id}. \n${err}`);
            return null;
        }
    }

    /**
     * Funzione per il recupero del numero totale dei Pokémon attuali
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    protected async GetCountPokemonList(cacheTTL?: number): Promise<number> {
        try {
            const { data } = await this.client.get<ListApi>(this.URL, {
                // passiamo opzioni di caching custom che il cache layer leggerà
                cacheTTL,
            } as ExtendedRequestConfig);
            return data.count;
        } catch (err) {
            return NormalizeAndPrintError(err, { method: "get", function: 'GetCountPokemonList', class: 'PokemonRepository' });
        }
    }
}