import { EndpointApi } from "@/modules/pokegen/data/enums/EndpointApi";
import { HttpError } from "@/infrastructure/http/errors/HttpError";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokeApiResponseDto } from "@/modules/pokegen/data/models/dtos/PokeApiResponseDto";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Data source per ottenere la lista delle risorse delle generazioni di Pokémon.
 */
export class ResourceListDataSource implements IDataSource<PokeApiResponseDto> {
        private readonly BASE_URL = EndpointApi.Generation;
    
        constructor(
            protected readonly httpClient: IHttpClient,
            protected readonly httpErrorMapper: IHttpErrorMapper,
            protected readonly logger: ILogger,
        ) {}
    
        /**
         * Recupera i dati dell'entry point delle generazioni Pokémon.
         * @returns Una promessa che risolve i dati tipizzati come PokeApiResponseDto
         * 
         * @throws DataSourceError se il recupero dei dati fallisce
         */
        async fetchData(): Promise<PokeApiResponseDto> {
            try {
                const response = await this.httpClient.get<PokeApiResponseDto>(this.BASE_URL);
                return response;
            } catch (error) {
                if(error instanceof HttpError)
                    this.httpErrorMapper.map(error);
                throw new ExternalServiceUnavailableError("Error fetching resource list data. \n Details: External service unavailable." + (error as Error).message);
            }
        }
}