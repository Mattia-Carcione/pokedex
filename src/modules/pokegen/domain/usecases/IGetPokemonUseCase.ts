import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { Pokemon } from "../entities/Pokemon";

/**
 * Interfaccia per il caso d'uso di recupero dei Pokémon per generazione.
 */
export interface IGetPokemonUseCase extends IUseCaseBase<Pokemon[]> { }