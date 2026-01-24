import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/modules/pokegen/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { PokemonSpeciesDto } from "@/modules/pokegen/data/models/dtos/PokemonSpeciesDto";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Data source per ottenere i dati dei Pokémon.
 */
export class PokemonSpeciesDataSource implements IDataSource<PokemonSpeciesDto> {
    protected readonly BASE_URI = EndpointApi.PokemonSpecies;
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IHttpErrorMapper,
        private readonly logger: ILogger
    ) {}
    
    /**
     * Recupera i dati del Pokémon da un endpoint specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come PokemonSpeciesDto
     * 
     * @throws DataSourceError se il recupero dei dati fallisce
     */
    async fetchData(endpoint: string, options?: { signal?: AbortSignal }): Promise<PokemonSpeciesDto> {
        try {            
            endpoint = endpoint.startsWith("http") ? endpoint : this.BASE_URI + endpoint;
            const response = await this.httpClient.get<PokemonSpeciesDto>(endpoint, options);
            this.logger.debug("Dati del Pokémon recuperati con successo da: " + endpoint, response);
            return response;
        } catch (error) {
            this.logger.error("[PokemonSpeciesDataSource] - Errore nel recupero dei dati del Pokémon: " + (error as Error).message);
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching Pokémon Species data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}