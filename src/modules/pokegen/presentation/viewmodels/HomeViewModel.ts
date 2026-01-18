import { Pokemon } from "../../domain/entities/Pokemon";
/**
 * Tipo di ViewModel per la generazione di Pokémon.
 */
export class HomeViewModel {
  constructor(
    public readonly generationId: number,
    public readonly generationName: string,
    public readonly pokemon: Pokemon[]
  ) {}
};