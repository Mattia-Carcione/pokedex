import { IDataSource } from "@/core/contracts/data/IDataSource";
import { EndpointApi } from "@/modules/pokegen/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { PokemonDto } from "@/modules/pokegen/data/models/dtos/PokemonDto";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

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
    async fetchData(endpoint: string): Promise<PokemonDto> {
        try {
            endpoint = endpoint.startsWith("http") ? endpoint : this.BASE_URI + endpoint;
            endpoint = endpoint.replace(EndpointApi.PokemonSpecies, EndpointApi.Pokemon);
            const response = await this.httpClient.get<PokemonDto>(endpoint);
            this.logger.debug("Dati del Pokémon recuperati con successo da: " + endpoint, response);
            return response;
        } catch (error) {
            this.logger.error("[PokemonDataSource] - Errore nel recupero dei dati del Pokémon: " + (error as Error).message);
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching Pokémon data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}