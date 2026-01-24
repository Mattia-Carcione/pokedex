import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { FactoryHelper } from "@/core/utils/factories/FactoryHelper";
import { PokemonDataSource } from "../datasources/PokemonDataSource";
import { PokemonMockDataSource } from "../datasources/mock/PokemonMockDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokemonSpeciesDataSource } from "../datasources/PokemonSpeciesDataSources";
import { PokemonSpeciesMockDataSource } from "../datasources/mock/PokemonSpeciesMockDataSource";
import { GenerationDataSource } from "../datasources/GenerationDataSource";
import { GenerationMockDataSource } from "../datasources/mock/GenerationMockDataSource";
import { PokeApiResponseDataSource } from "../datasources/PokeApiResponseDataSource";
import { PokeApiResponseMockDataSource } from "../datasources/mock/PokeApiResponseMockDataSource";
import { PokegenDataSourceTypesEnum } from "../enums/PokegenDataSourceTypesEnum";
import { PokeApiResponseDto } from "../models/dtos/PokeApiResponseDto";
import { PokegenDataSourceFactoryMappingType } from "../types/PokegenDataSourceFactoryMappingType";
import { PokemonDto } from "../models/dtos/PokemonDto";
import { PokemonSpeciesDto } from "../models/dtos/PokemonSpeciesDto";
import { GenerationDto } from "../models/dtos/GenerationDto";

/**
 * Factory per la creazione delle istanze dei datasource
 */
export class PokegenDataSourceFactory {
    private constructor() {}

    /**
     * Metodo per la creazione delle istanze dei datasource
     * @param env [EnvironmentEnum] - Variabile di ambiente.
     * @param type [PokegenDataSourceTypesEnum] - Tipo di datasource richiesto.
     * @param deps [{ httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }] - Dipendenze dei datasource richiesti.
     * @returns Ritorna IDataSource<T> in base al tipo richiesto.
     */
    static create<T extends PokegenDataSourceTypesEnum>(env: EnvironmentEnum, type: T, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): PokegenDataSourceFactoryMappingType[T] {
        switch (type) {
            case PokegenDataSourceTypesEnum.Pokemon:
                return this.createPokemonDataSource(env, deps) as PokegenDataSourceFactoryMappingType[T];
            case PokegenDataSourceTypesEnum.PokemonSpecies:
                return this.createPokemonSpeciesDataSource(env, deps) as PokegenDataSourceFactoryMappingType[T];
            case PokegenDataSourceTypesEnum.Generation:
                return this.createGenerationDataSource(env, deps) as PokegenDataSourceFactoryMappingType[T];
            case PokegenDataSourceTypesEnum.PokeApiResponse:
                return this.createPokeApiResponseDataSource(env, deps) as PokegenDataSourceFactoryMappingType[T];
        default:
            throw new Error(`DataSourceFactory: tipo non supportato ${type}`);
        }
    }

    private static createPokemonDataSource(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<PokemonDto> {
        return FactoryHelper.createByEnvHelper<IDataSource<PokemonDto>>(env, () => new PokemonDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new PokemonMockDataSource());
    }

    private static createPokemonSpeciesDataSource(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<PokemonSpeciesDto> {
        return FactoryHelper.createByEnvHelper<IDataSource<PokemonSpeciesDto>>(env, () => new PokemonSpeciesDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new PokemonSpeciesMockDataSource());
    }

    private static createGenerationDataSource(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<GenerationDto> {
        return FactoryHelper.createByEnvHelper<IDataSource<GenerationDto>>(env, () => new GenerationDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new GenerationMockDataSource());
    }
    
    private static createPokeApiResponseDataSource(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<PokeApiResponseDto> {
        return FactoryHelper.createByEnvHelper<IDataSource<PokeApiResponseDto>>(env, () => new PokeApiResponseDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new PokeApiResponseMockDataSource());
    }
 }
