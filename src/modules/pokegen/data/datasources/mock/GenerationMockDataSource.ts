import generationMockData from "@/../assets/mock_data/generation.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { GenerationDto } from "../../models/dtos/GenerationDto";

/**
 * Mock Data source per ottenere i dati delle generazioni Pokémon da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class GenerationMockDataSource implements IDataSource<GenerationDto> {
    private mockData: GenerationDto;

    constructor() {
        this.mockData = generationMockData as GenerationDto;
    }
    
    /**
     * Recupera i dati della generazione da mock data locale.
     * @param endpoint - L'endpoint (ignorato nel mock, ritorna sempre la stessa generazione)
     * @returns Una promessa che risolve i dati della generazione tipizzati come GenerationDto
     * 
     * @throws DataSourceError se il recupero dei dati fallisce
     */
    async fetchData(_endpoint: string): Promise<GenerationDto> {
        try {
            // Simula un piccolo delay per replicare il comportamento di una chiamata HTTP
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Verifica che i dati mock siano validi
            if (!this.mockData || !this.mockData.id) {
                throw new Error("Dati mock non validi o mancanti");
            }
            
            return this.mockData;
        } catch (error) {
            throw new ExternalServiceUnavailableError("Errore nel recupero dei dati della generazione dal mock." + " \n Dettagli: " + (error as Error).message);
        }
    }

    /**
     * Metodo helper per aggiornare i dati mock durante i test.
     * @param newData - I nuovi dati mock da utilizzare
     */
    setMockData(newData: GenerationDto): void {
        this.mockData = newData;
    }
}
