import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/modules/pokegen/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { GenerationDto } from "../models/dtos/GenerationDto";

/**
 * Data source per ottenere i dati delle generazioni Pokémon.
 */
export class GenerationDataSource implements IDataSource<GenerationDto> {
    protected readonly BASE_URI = EndpointApi.Generation;
    private readonly message = "[GenerationDataSource] - Errore nel recupero dei dati della generazione. ";
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
        try {
            endpoint = endpoint.startsWith("http") ? endpoint : this.BASE_URI + endpoint;
            const response = await this.httpClient.get<GenerationDto>(endpoint, options);
            this.logger.debug("[GenerationDataSource] - Dati della generazione recuperati con successo da: " + endpoint, response);
            return response;
        } catch (error) {
            this.logger.error(this.message + (error as Error).message);
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching generation data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}