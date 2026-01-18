import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { PokemonSpeciesDTO } from "../models/dtos/PokemonSpeciesDto";
import pokemonMockData from "@/../assets/mock_data/pokemon.json";
import { ExternalServiceUnavailableError } from "@/shared/core/errors/ExternalServiceUnavailableError";

/**
 * Mock Data source per ottenere i dati dei Pokémon da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class PokemonSpeciesMockDataSource implements IDataSource<PokemonSpeciesDTO> {
    private mockData: PokemonSpeciesDTO;

    constructor() {
        this.mockData = pokemonMockData as PokemonSpeciesDTO;
    }
    
    /**
     * Recupera i dati del Pokémon da mock data locale.
     * @param endpoint - L'endpoint (ignorato nel mock, ritorna sempre lo stesso Pokémon)
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come PokemonSpeciesDTO
     * 
     * @throws DataSourceError se il recupero dei dati fallisce
     */
    async fetchData(_endpoint: string): Promise<PokemonSpeciesDTO> {
        try {
            // Simula un piccolo delay per replicare il comportamento di una chiamata HTTP
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Verifica che i dati mock siano validi
            if (!this.mockData || !this.mockData.id) {
                throw new Error("Dati mock non validi o mancanti");
            }
            
            return this.mockData;
        } catch (error) {
            throw new ExternalServiceUnavailableError("Errore nel recupero dei dati del Pokémon dal mock." + " \n Dettagli: " + (error as Error).message);
        }
    }

    /**
     * Metodo helper per aggiornare i dati mock durante i test.
     * @param newData - I nuovi dati mock da utilizzare
     */
    setMockData(newData: PokemonSpeciesDTO): void {
        this.mockData = newData;
    }
}
