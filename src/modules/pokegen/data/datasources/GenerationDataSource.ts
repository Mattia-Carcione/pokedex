import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { GenerationDto } from "../models/dtos/GenerationDto";
import { checkEndpoint } from "@/core/utils/network/CheckEndpoint";

/**
 * Data source per ottenere i dati delle generazioni Pokémon.
 */
export class GenerationDataSource implements IDataSource<GenerationDto> {
    protected readonly BASE_URI = EndpointApi.Generation;

    constructor(
        protected readonly httpClient: IHttpClient,
        protected readonly httpErrorMapper: IHttpErrorMapper,
        protected readonly logger: ILogger,
    ) {}
    
    /**
     * Recupera i dati della generazione da PokeAPI.
     * @param endpoint - L'endpoint da cui recuperare i dati della generazione
     * @returns Una promessa che risolve i dati della generazione tipizzati come GenerationDto
     * @throws ExternalServiceUnavailableError se il servizio esterno non è disponibile o si verifica un errore durante il recupero dei dati
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<GenerationDto> {
        this.logger.debug("[GenerationDataSource] - Inizio del recupero dei dati della generazione con endpoint: " + endpoint);
        
        try {
            endpoint = checkEndpoint(endpoint, this.BASE_URI, "[GenerationDataSource]", this.logger);

            const response = await this.httpClient.get<GenerationDto>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching generation data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}