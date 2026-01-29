import { IUseCaseBase } from "@/core/contracts/application/IUseCaseBase";
import { NamedResource } from "@/core/types/CommonTypes";
/**
 * Interfaccia per il caso d'uso di recupero di un array di NamedResource.
 */
export interface IGetPokeApiUseCase extends IUseCaseBase<NamedResource[]> { }