/**
* services/PokemonSpeciesService
* Esempio di service di business logic che usa repository.
* Il service può decidere politiche di invalidazione, fallback su cache scaduta, ecc.
*/
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { ExtendedRequestConfig } from "@/lib/types/axiosExtendedTypes";
import { PokemonSpeciesRepository } from "@/repositories/pokemonSpeciesRepository";
import { CardPokemon } from "@/types/components/cardPokemon";
import { DetailPkm } from "@/types/components/detailPkm";
import { ListApi } from "@/types/pokeApi";
import { Mapper } from "@/utils/mapper";
import { PokemonService } from "./pokemonService";
import { GenerationRepository } from "@/repositories/generationRepository";
import { Pokemon } from "@/types/pokemon/pokemon";
import { Generation } from "@/types/pokemon/generation";

/**
 * Servizio per il recupero dei dati dalle generazioni
 */
export class PokemonSpeciesService extends PokemonService {
    private _repoSps = new PokemonSpeciesRepository(this.client);
    constructor() { super(pokeApiClient) }

    /**
     * Funzione per la creazione della card del Pokémon
     * @param id (number) - identificativo del Pokémon
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async CreateCardDetailPokemon(id: number, cacheTTL?: number): Promise<DetailPkm | null> {
        try {
            id = Number(id);
            const pkm = await this._repo.Get(id, cacheTTL);
            if (!pkm) return null;
            
            const pkmSpecies = await this._repoSps.Get(id, cacheTTL);
            if (!pkmSpecies) return null;
            
            let prev = null;
            if(id - 1 > 0) prev = await this._repo.Get((id - 1), cacheTTL);
            const next = await this._repo.Get((id + 1), cacheTTL);

            const count = await this.GetCountPokemonList(cacheTTL);

            return Mapper.DetailPokemonMapper(pkm, pkmSpecies, prev, next, count);
        } catch (err) {
            console.warn(`Error CreateCardDetailPokemon PokemonSpeciesService fetching data ${id}. \n${err}`);
            return null;
        }
    }

    /**
     * Funzione per la creazione delle card dei Pokémon di una generazione specifica
     * @param id (number) - identificativo della generazione
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    override async CreateAllCardByGen(id: number, cacheTTL?: number): Promise<CardPokemon[] | null> {
        const resp = await this._repo.GetAllByGen(id, cacheTTL);
        if (!resp) return null;
        const data = resp.sort((a: any, b: any) => a.id - b.id);
        const count = await this.GetCountPokemonList(cacheTTL);
        return data.map((x) => Mapper.CardPokemonMapper(x, count));
    }
}