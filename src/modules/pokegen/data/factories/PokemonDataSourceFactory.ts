import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokemonDataSource } from "../datasources/PokemonDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { PokemonDTO } from "../models/dtos/PokemonDto";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { PokemonMockDataSource } from "../datasources/mock/PokemonMockDataSource";
import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Factory per creare istanze di IDataSource<PokemonDTO>.
 */
export class PokemonDataSourceFactory {
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IHttpErrorMapper,
        private readonly logger: ILogger
    ) {}

    /**
     * Crea un'istanza di IDataSource<PokemonDTO>.
     * @param x - Se true, crea un'istanza di PokemonDataSource, altrimenti crea un'istanza di PokemonMockDataSource.
     * @returns Un'istanza di IDataSource<PokemonDTO>.
     */
    create(input: EnvironmentEnum): IDataSource<PokemonDTO> {
        switch(input) {
            case EnvironmentEnum.DEVELOPMENT:
                return new PokemonMockDataSource();
            default:
                return new PokemonDataSource(this.httpClient, this.httpErrorMapper, this.logger);
        }
    }
}