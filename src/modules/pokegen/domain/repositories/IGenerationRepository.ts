import { Generation } from "../entities/Generation";

/**
 * Interfaccia per il repository di generazione dei Pokémon.
 */
export interface IGenerationRepository {
    /**
     * Recupera i dati di una generazione specifica.
     * @param endpoint - L'endpoint da cui recuperare i dati della generazione
     * @returns Una promessa che risolve i dati della generazione tipizzati come T
    */
    get(endpoint: string): Promise<Generation>;
}