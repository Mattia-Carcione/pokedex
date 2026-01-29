import { IRepository } from "@/core/contracts/data/IRepository";
import { NamedResource } from "@/core/types/CommonTypes";

/**
 * Interfaccia Repository per il PokeApiResponseDto dell'applicazione.
 */
export interface IPokeApiRepository extends IRepository<NamedResource> { }