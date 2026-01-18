import { Result } from "@/shared/core/interfaces/domain/entities/Result";
import { GenerationCollection } from "../entities/GenerationMap";

/**
 * Interfaccia per il caso d'uso di recupero dei Pokémon per generazione.
 */
export interface IGetPokemonByGeneration {
    /**
     * Recupera i Pokémon appartenenti a una specifica generazione.
     * @returns Una promessa che risolve una lista di ID dei Pokémon appartenenti alla generazione specificata
    */
    execute(): Promise<Result<GenerationCollection, Error>>
}