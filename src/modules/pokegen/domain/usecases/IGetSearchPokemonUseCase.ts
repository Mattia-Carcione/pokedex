import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { Pokemon } from "../entities/Pokemon";

/**
 * Interfaccia per il caso d'uso di recupero dei Pokémon per ricerca.
 */
export interface IGetSearchPokemonUseCase extends IUseCaseBase<Pokemon> { }