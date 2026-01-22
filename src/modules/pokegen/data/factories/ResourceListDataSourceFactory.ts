import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ResourceListDataSource } from "../datasources/ResourceListDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { PokeApiResponseDto } from "../models/dtos/PokeApiResponseDto";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { ResourceListMockDataSource } from "../datasources/mock/ResourceListMockDataSource";
import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Factory per creare istanze di IDataSource<PokeApiResponseDto>.
 */
export class ResourceListDataSourceFactory {
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IHttpErrorMapper,
        private readonly logger: ILogger
    ) {}

    /**
     * Crea un'istanza di IDataSource<PokeApiResponseDto>.
     * @param x - Se true, crea un'istanza di ResourceListDataSource, altrimenti crea un'istanza di ResourceListMockDataSource.
     * @returns Un'istanza di IDataSource<PokeApiResponseDto>.
     */
    create(input: EnvironmentEnum): IDataSource<PokeApiResponseDto> {
        switch(input) {
            case EnvironmentEnum.DEVELOPMENT:
                return new ResourceListMockDataSource();
            default:
                return new ResourceListDataSource(this.httpClient, this.httpErrorMapper, this.logger);
        }
    }
}