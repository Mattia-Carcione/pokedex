import { PokemonSpecies } from "../entities/PokemonSpecies";

/**
 * Interfaccia per il repository dei Pokémon.
 */
export interface IPokemonSpeciesRepository {
    /**
     * Recupera i dati di un Pokémon specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come T
    */
    get(endpoint: string): Promise<PokemonSpecies>;
}