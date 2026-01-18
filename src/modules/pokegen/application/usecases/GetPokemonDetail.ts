import { Result } from "@/shared/core/interfaces/domain/entities/Result";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { IPokemonSpeciesRepository } from "../../domain/repositories/IPokemonSpeciesRepository";
import { IGetPokemonDetail } from "../../domain/usecases/IGetPokemonDetail";
import { PokemonDetail } from "../../domain/entities/PokemonDetail";

export class GetPokemonDetail implements IGetPokemonDetail {
    protected readonly BASE_POKEMON_URI = 'https://pokeapi.co/api/v2/pokemon/';
    protected readonly BASE_SPECIES_URI = 'https://pokeapi.co/api/v2/pokemon-species/';

    constructor(
        private readonly pokemonRepository: IPokemonRepository,
        private readonly pokemonSpeciesRepository: IPokemonSpeciesRepository,
    ) { }

    async execute(id: string): Promise<Result<PokemonDetail, Error>> {
        try {
            const pokemon = await this.pokemonRepository.get(`${this.BASE_POKEMON_URI}${id}`);
            const species = await this.pokemonSpeciesRepository.get(`${this.BASE_SPECIES_URI}${id}`);
            const pkmDetail = new PokemonDetail(pokemon, species);
            return new Result<PokemonDetail, Error>(true, pkmDetail, null);
        } catch (error) {
            console.error(error);
            return new Result<PokemonDetail, Error>(false, null, error as Error);
        }
    }
}