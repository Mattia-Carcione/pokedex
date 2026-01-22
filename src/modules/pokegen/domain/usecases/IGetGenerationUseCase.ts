import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { Generation } from "../entities/Generation";

/**
 * Interfaccia per il caso d'uso di recupero della generazione dei Pokémon.
 */
export interface IGetGenerationUseCase extends IUseCaseBase<Generation[]> { }