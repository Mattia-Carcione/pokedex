import { IDataSource } from "@/core/contracts/data/IDataSource";
import { GenerationDTO } from "@/modules/pokegen/data/models/dtos/GenerationDto";
import { PokeApiResponseDto } from "@/modules/pokegen/data/models/dtos/PokeApiResponseDto";
import { PokemonDTO } from "@/modules/pokegen/data/models/dtos/PokemonDto";

/**
 * Facade per accedere ai data source delle generazioni e dei Pokémon.
 */
export interface IGenerationDataSourceFacade {
    generationDS: IDataSource<GenerationDTO>,
    pokeapiDS: IDataSource<PokeApiResponseDto>,
    pokemonDS: IDataSource<PokemonDTO>,
}