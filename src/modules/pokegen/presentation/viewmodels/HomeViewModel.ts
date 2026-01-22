import { PokemonVM } from "./types/PokemonVM";
/**
 * Tipo di ViewModel per la generazione di Pokémon.
 */
export class HomeViewModel {
  constructor(
    public readonly pokemon: PokemonVM[]
  ) {}
};