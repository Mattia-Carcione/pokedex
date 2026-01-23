import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokemonDto } from "../models/Dtos/PokemonDto";
import { createByEnvHelper } from "@/core/utils/factories/CreateByEnvHelper";
import { PokemonDataSource } from "../datasources/PokemonDataSource";
import { PokemonMockDataSource } from "../datasources/mock/PokemonMockDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokemonSpeciesDto } from "../models/Dtos/PokemonSpeciesDto";
import { PokemonSpeciesDataSource } from "../datasources/PokemonSpeciesDataSources";
import { PokemonSpeciesMockDataSource } from "../datasources/mock/PokemonSpeciesMockDataSource";
import { GenerationDataSource } from "../datasources/GenerationDataSource";
import { GenerationMockDataSource } from "../datasources/mock/GenerationMockDataSource";
import { GenerationDto } from "../models/Dtos/GenerationDto";
import { PokeApiResponseDataSource } from "../datasources/PokeApiResponseDataSource";
import { PokeApiResponseMockDataSource } from "../datasources/mock/PokeApiResponseMockDataSource";
import { PokegenDataSourceFactoryMappingType } from "../types/PokegenDataSourceFactoryMappingType";
import { PokegenDataSourceTypesEnum } from "../enums/PokegenDataSourceTypesEnum";
import { PokeApiResponseDto } from "../models/Dtos/PokeApiResponseDto";

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
        return createByEnvHelper<IDataSource<PokemonDto>>(env, () => new PokemonDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new PokemonMockDataSource());
    }

    private static createPokemonSpeciesDataSource(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<PokemonSpeciesDto> {
        return createByEnvHelper<IDataSource<PokemonSpeciesDto>>(env, () => new PokemonSpeciesDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new PokemonSpeciesMockDataSource());
    }

    private static createGenerationDataSource(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<GenerationDto> {
        return createByEnvHelper<IDataSource<GenerationDto>>(env, () => new GenerationDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new GenerationMockDataSource());
    }
    
    private static createPokeApiResponseDataSource(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<PokeApiResponseDto> {
        return createByEnvHelper<IDataSource<PokeApiResponseDto>>(env, () => new PokeApiResponseDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new PokeApiResponseMockDataSource());
    }
 }
