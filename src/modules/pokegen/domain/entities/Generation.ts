import { Pokemon } from "./Pokemon";

/**
 * Rappresenta una generazione di Pokémon.
 * @property id (number) - l'id della generazione
 * @property name (string) - il nome della generazione
 * @property pokemonList (Pokemon[]) - la lista delle specie di Pokémon appartenenti a questa generazione
 */
export class Generation {
    constructor(
        public readonly version: number,
        public readonly name: string,
        public pokemon: Pokemon[] = []
    ) {}
}