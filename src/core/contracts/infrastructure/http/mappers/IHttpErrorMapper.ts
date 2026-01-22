import { IMapper } from "@/core/contracts/mappers/IMapper";

/**
 * Interfaccia per il mapper degli errori HTTP.
 */
export interface IHttpErrorMapper extends IMapper<unknown, never> { }