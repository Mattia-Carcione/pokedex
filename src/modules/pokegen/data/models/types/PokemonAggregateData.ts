import { PokemonDTO } from "../dtos/PokemonDto";
import { PokemonSpeciesDTO } from "../dtos/PokemonSpeciesDto";

/**
 * Aggregato di dati del Pokémon, comprensivo di informazioni base, specie, evoluzioni e forme.
 */
export interface PokemonAggregateData {
    pokemon: PokemonDTO;
    species?: PokemonSpeciesDTO;
    evolutions?: any;
    forms?: any;
}