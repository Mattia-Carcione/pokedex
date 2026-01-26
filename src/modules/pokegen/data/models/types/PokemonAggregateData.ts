import { EvolutionChainDto } from "../dtos/EvolutionChainDto";
import { PokemonDto } from "../dtos/PokemonDto";
import { PokemonSpeciesDto } from "../dtos/PokemonSpeciesDto";

/**
 * Aggregato di dati del Pokémon, comprensivo di informazioni base, specie, evoluzioni e forme.
 */
export interface PokemonAggregateData {
    pokemon: PokemonDto;
    species?: PokemonSpeciesDto;
    evolution?: EvolutionChainDto;
    spritesMap?: Record<string, string>;
    forms?: any;
}