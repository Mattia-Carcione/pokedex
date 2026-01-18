import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { IHttpClient } from "@/shared/core/interfaces/infrastructure/http/IHttpClient";
import { NormalizedHttpError } from "@/shared/infrastructure/http/errors/NormalizedHttpError";
import { mapHttpError } from "@/shared/infrastructure/http/errors/MapHttpError";
import { ExternalServiceUnavailableError } from "@/shared/core/errors/ExternalServiceUnavailableError";
import { GenerationDTO } from "../models/dtos/GenerationDto";

/**
 * Data source per ottenere i dati delle generazioni Pokémon.
 */
export class GenerationDataSource implements IDataSource<GenerationDTO> {
    constructor(
        protected readonly httpClient: IHttpClient
    ) {}
    
    /**
     * Recupera i dati della generazione da PokeAPI.
     * @param endpoint - L'endpoint da cui recuperare i dati della generazione
     * @returns Una promessa che risolve i dati della generazione tipizzati come GenerationDTO
     * @throws ExternalServiceUnavailableError se il servizio esterno non è disponibile o si verifica un errore durante il recupero dei dati
     */
    async fetchData(endpoint: string): Promise<GenerationDTO> {
        try {
            const response = await this.httpClient.get<GenerationDTO>(endpoint);
            return response;
        } catch (error) {
            if(error instanceof NormalizedHttpError)
                mapHttpError(error);

            throw new ExternalServiceUnavailableError("Errore nel recupero dei dati della generazione. \n Dettagli: " + (error as Error).message);
        }
    }
}