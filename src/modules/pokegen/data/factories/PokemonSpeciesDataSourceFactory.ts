import { IDataSource } from "@/core/contracts/data/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { PokemonSpeciesDTO } from "../models/dtos/PokemonSpeciesDto";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { PokemonSpeciesMockDataSource } from "../datasources/mock/PokemonSpeciesMockDataSource";
import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { PokemonSpeciesDataSource } from "../datasources/PokemonSpeciesDataSources";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Factory per creare istanze di IDataSource<PokemonSpeciesDTO>.
 */
export class PokemonSpeciesDataSourceFactory {
    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IHttpErrorMapper,
        private readonly logger: ILogger
    ) {}

    /**
     * Crea un'istanza di IDataSource<PokemonSpeciesDTO>.
     * @param x - Se true, crea un'istanza di PokemonSpeciesDataSource, altrimenti crea un'istanza di PokemonSpeciesMockDataSource.
     * @returns Un'istanza di IDataSource<PokemonSpeciesDTO>.
     */
    create(input: EnvironmentEnum): IDataSource<PokemonSpeciesDTO> {
        switch(input) {
            case EnvironmentEnum.DEVELOPMENT:
                return new PokemonSpeciesMockDataSource();
            default:
                return new PokemonSpeciesDataSource(this.httpClient, this.httpErrorMapper, this.logger);
        }
    }
}