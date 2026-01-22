import { IDataSource } from "@/core/contracts/data/IDataSource";
import { GenerationDataSource } from "../datasources/GenerationDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { GenerationDTO } from "../models/dtos/GenerationDto";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { GenerationMockDataSource } from "../datasources/mock/GenerationMockDataSource";
import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Factory per creare istanze di IDataSource<GenerationDTO>.
 */
export class GenerationDataSourceFactory {
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IHttpErrorMapper,
        private readonly logger: ILogger
    ) {}

    /**
     * Crea un'istanza di IDataSource<GenerationDTO>.
     * @param x - Se true, crea un'istanza di GenerationDataSource, altrimenti crea un'istanza di GenerationMockDataSource.
     * @returns Un'istanza di IDataSource<GenerationDTO>.
     */
    create(input: EnvironmentEnum): IDataSource<GenerationDTO> {
        switch(input) {
            case EnvironmentEnum.DEVELOPMENT:
                return new GenerationMockDataSource();
            default:
                return new GenerationDataSource(this.httpClient, this.httpErrorMapper, this.logger);
        }
    }
}