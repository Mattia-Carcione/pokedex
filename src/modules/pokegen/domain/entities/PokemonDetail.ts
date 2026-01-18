import { Pokemon } from "./Pokemon"
import { PokemonSpecies } from "./PokemonSpecies";

/**
 * Rappresenta il dettaglio completo di un Pokémon nel dominio dell'applicazione.
 * Combina le informazioni di base del Pokémon con i dettagli specifici della specie.
 */
export class PokemonDetail {
    constructor (
        public readonly pokemon: Pokemon,
        public readonly species: PokemonSpecies
    ) {}
}