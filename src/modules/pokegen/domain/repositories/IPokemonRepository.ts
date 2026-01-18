import { Pokemon } from "../entities/Pokemon";

/**
 * Interfaccia per il repository dei Pokémon.
 */
export interface IPokemonRepository {
    /**
     * Recupera i dati di un Pokémon specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come T
    */
    get(endpoint: string): Promise<Pokemon>;
}