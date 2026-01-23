import PokeApiResponseMockData from "@/../assets/mock_data/resource-list.json";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { PokeApiResponseDto } from "@/modules/pokegen/data/models/Dtos/PokeApiResponseDto";

/**
 * Mock Data source per ottenere la lista delle generazioni Pokémon da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class PokeApiResponseMockDataSource implements IDataSource<PokeApiResponseDto> {
    private mockData: PokeApiResponseDto;

    constructor() {
        this.mockData = PokeApiResponseMockData as PokeApiResponseDto;
    }

    /**
     * Metodo non applicabile per questo data source.
     * @throws Error sempre, poiché non implementato.
     */
    async fetchData(): Promise<any> {
        try {
            // Simula un piccolo delay per replicare il comportamento di una chiamata HTTP
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Verifica che i dati mock siano validi
            if (!this.mockData || !this.mockData.results) {
                throw new Error("Dati mock dell'entry point non validi o mancanti");
            }
            return this.mockData;
        } catch (error) {
            throw new ExternalServiceUnavailableError("Errore nel recupero dei dati dell'entry point dal mock." + " \n Dettagli: " + (error as Error).message);
        }
    }


    /**
     * Metodo helper per aggiornare i dati mock durante i test.
     * @param newData - I nuovi dati mock da utilizzare
     */
    setMockData(newData: PokeApiResponseDto): void {
        this.mockData = newData;
    }
}
