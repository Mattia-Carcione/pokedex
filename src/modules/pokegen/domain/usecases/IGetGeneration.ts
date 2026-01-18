import { Result } from "@/shared/core/interfaces/domain/entities/Result";
import { Generation } from "../entities/Generation";

/**
 * Interfaccia per il caso d'uso di recupero della generazione dei Pokémon.
 */
export interface IGetGeneration {
    /**
     * Recupera i Pokémon appartenenti a una specifica generazione.
     * @returns Una promessa che risolve una lista di ID dei Pokémon appartenenti alla generazione specificata
    */
    execute(): Promise<Result<Generation[], Error>>
}