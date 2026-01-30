import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/shared/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { PokemonDto } from "@/modules/pokegen/data/models/dtos/PokemonDto";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { checkEndpoint } from "@/core/utils/network/CheckEndpoint";

/**
 * Data source per ottenere i dati dei Pokémon.
 */
export class PokemonDataSource implements IDataSource<PokemonDto> {
    protected readonly BASE_URI = EndpointApi.Pokemon;
    protected readonly GENERATION_URI = EndpointApi.Generation;
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IHttpErrorMapper,
        private readonly logger: ILogger
    ) {}
    
    /**
     * Recupera i dati del Pokémon da un endpoint specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come PokemonDto
     * 
     * @throws ExternalServiceUnavailableError se il recupero dei dati fallisce
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<PokemonDto> {
        this.logger.debug("[PokemonDataSource] - Inizio del recupero dei dati del Pokémon con endpoint: " + endpoint);
        
        try {
            endpoint = checkEndpoint(endpoint, this.BASE_URI, "[PokemonDataSource]", this.logger);
            
            endpoint = endpoint.replace(EndpointApi.PokemonSpecies, EndpointApi.Pokemon);
            const response = await this.httpClient.get<PokemonDto>(endpoint, options);
            return response;
        } catch (error) {
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching Pokémon data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}