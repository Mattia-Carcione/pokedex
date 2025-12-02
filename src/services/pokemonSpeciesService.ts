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
    private _genRepo = new GenerationRepository(this.client);
    private URL_SPECIES = 'https://pokeapi.co/api/v2/pokemon-species';
    constructor() { super(pokeApiClient) }

    /**
     * Funzione per la creazione della card del Pokémon
     * @param id (number) - identificativo del Pokémon
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer
     */
    async CreateCardDetailPokemon(id: number, cacheTTL?: number): Promise<DetailPkm | null> {
        try {
            id = Number(id);
            const cardPkm = await this.CreateCardPokemon(id, cacheTTL);
            if (!cardPkm) return null;
            
            const resp = await this._repoSps.Get(id, cacheTTL);
            if (!resp) return null;
            
            const { next, prev } = await this.GetNextAndPrev(id, cacheTTL);
            
            const count = await this.GetCountPokemonList(cacheTTL);

            return Mapper.DetailPokemonMapper(cardPkm, resp, prev, next, count);
        } catch (err) {
            console.warn(`Error CreateCardDetailPokemon PokemonSpeciesService fetching data ${id}. \n${err}`);
            return null;
        }
    }

    private async GetNextAndPrev(id: number, cacheTTL?: number): Promise<{ next: Pokemon | null, prev: Pokemon | null }> {
        try {
            let prev = null;
            let next = null;
            id = Number(id);
            const gen = await this._genRepo.GetAll(cacheTTL);
            const idPrev = id - 1;
            if (idPrev > 0) prev = await this.GetPrevOrNext(idPrev, gen);
            const idNext = id + 1;
            const pkmNext = await this.GetPrevOrNext(idNext, gen);
            if(pkmNext) next = pkmNext;
            return { next, prev }
        } catch (err) {
            console.warn(`Error GetNextAndPrev PokemonSpeciesService fetching data ${id}. \n${err}`);
            return null;
        }
    }

    async GetPrevOrNext(id: any, gen: Generation[]): Promise<Pokemon | void> {
        try {
            const spcs = gen.find(x => x.pokemon_species.find(pkm => pkm.url === `${this.URL_SPECIES}/${id}/`))?.pokemon_species.find(p => p.url === `${this.URL_SPECIES}/${id}/`);
            if (!spcs) return null;
            const url = spcs.url.replace('-species', '');
            const resp = await this.client.get<Pokemon>(url);
            return resp.data;
        } catch (err) {
            console.warn(`Error GetPrevOrNext PokemonSpeciesService fetching data ${id}. \n${err}`);
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