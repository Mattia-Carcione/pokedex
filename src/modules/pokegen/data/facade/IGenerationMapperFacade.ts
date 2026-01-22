import { IGenerationMapper } from "@/modules/pokegen/application/mappers/contracts/IGenerationMapper";
import { IPokemonMapper } from "@/modules/pokegen/application/mappers/contracts/IPokemonMapper";

/**
 * Facade per accedere ai mapper delle generazioni e dei Pokémon.
 */
export interface IGenerationMapperFacade {
    generationMapper: IGenerationMapper;
    pokemonMapper: IPokemonMapper;
}