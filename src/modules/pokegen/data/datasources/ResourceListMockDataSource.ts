import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import resourceListMockData from "@/../assets/mock_data/resource-list.json";
import { PokeApiResponse } from "@/shared/core/types/ApiTypes";
import { NamedResource } from "@/shared/core/types/CommonTypes";
import { ExternalServiceUnavailableError } from "@/shared/core/errors/ExternalServiceUnavailableError";

/**
 * Mock Data source per ottenere la lista delle generazioni Pokémon da file JSON locali.
 * Utile per testing e sviluppo senza dipendere dall'API esterna.
 */
export class ResourceListMockDataSource implements IDataSource<PokeApiResponse<NamedResource>> {
    private mockData: PokeApiResponse<NamedResource>;

    constructor() {
        this.mockData = resourceListMockData as PokeApiResponse<NamedResource>;
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
    setMockData(newData: PokeApiResponse<NamedResource>): void {
        this.mockData = newData;
    }
}
