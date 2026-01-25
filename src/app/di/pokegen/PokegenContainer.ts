import { EnvironmentEnum } from "../../EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { PokemonViewMapper } from "@/modules/pokegen/presentation/mappers/PokemonViewMapper";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { useGenerationStore } from "@/modules/pokegen/presentation/store/UseGenerationStore";
import { usePokegenStore } from "@/modules/pokegen/presentation/store/UsePokegenStore";
import { NavBarMapper } from "@/modules/pokegen/presentation/mappers/NavbarMapper";
import { IGenerationRepository } from "@/modules/pokegen/domain/repositories/IGenerationRepository";
import { IPokemonRepository } from "@/modules/pokegen/domain/repositories/IPokemonRepository";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { IGetGenerationUseCase } from "@/modules/pokegen/domain/usecases/IGetGenerationUseCase";
import { IGetPokemonUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonUseCase";
import { IGetPokemonDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonDetailUseCase";
import { FactoryHelper } from "@/core/utils/factories/FactoryHelper";
import { GenerationMapper } from "@/modules/pokegen/application/mappers/GenerationMapper";
import { PokemonMapper } from "@/modules/pokegen/application/mappers/PokemonMapper";
import { GenerationDataSource } from "@/modules/pokegen/data/datasources/GenerationDataSource";
import { GenerationMockDataSource } from "@/modules/pokegen/data/datasources/mock/GenerationMockDataSource";
import { GenerationDto } from "@/modules/pokegen/data/models/dtos/GenerationDto";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokemonDto } from "@/modules/pokegen/data/models/dtos/PokemonDto";
import { PokemonDataSource } from "@/modules/pokegen/data/datasources/PokemonDataSource";
import { PokemonMockDataSource } from "@/modules/pokegen/data/datasources/mock/PokemonMockDataSource";
import { PokemonSpeciesDto } from "@/modules/pokegen/data/models/dtos/PokemonSpeciesDto";
import { PokemonSpeciesDataSource } from "@/modules/pokegen/data/datasources/PokemonSpeciesDataSources";
import { PokeApiResponseDto } from "@/modules/pokegen/data/models/dtos/PokeApiResponseDto";
import { PokeApiResponseMockDataSource } from "@/modules/pokegen/data/datasources/mock/PokeApiResponseMockDataSource";
import { PokeApiResponseDataSource } from "@/modules/pokegen/data/datasources/PokeApiResponseDataSource";
import { GenerationRepository } from "@/modules/pokegen/data/repositories/GenerationRepository";
import { PokemonRepository } from "@/modules/pokegen/data/repositories/PokemonRepository";
import { GetGenerationUseCase } from "@/modules/pokegen/application/usecases/GetGenerationUseCase";
import { GetPokemonUseCase } from "@/modules/pokegen/application/usecases/GetPokemonUseCase";
import { GetPokemonDetailUseCase } from "@/modules/pokegen/application/usecases/GetPokemonDetailUseCase";
import { UseGenerationController } from "@/modules/pokegen/presentation/controllers/UseGenerationController";
import { UsePokemonController } from "@/modules/pokegen/presentation/controllers/UsePokemonController";
import { PokemonSpeciesMockDataSource } from "@/modules/pokegen/data/datasources/mock/PokemonSpeciesMockDataSource";

/**
 * Classe statica per la creazione dei controller della feature pokegen.
 * 
 * Espone il metodo build per creare l'istanza dei controller.
 */
export class PokegenContainer {
    private constructor() {}

    /**
     * Metodo per l'inizializzazione dei controller della feature pokegen.
     * @param env (EnvironmentEnum) - il tipo di ambiente.
     * @param deps [{ httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }] - Dipendenze dei datasource richiesti.
     * @returns Ritorna un oggetto con le istanze dei controller.
     */
    static build(env: EnvironmentEnum, deps: {
        httpClient: IHttpClient;
        httpMapper: IHttpErrorMapper;
        logger: ILogger;
    }): {
        generationController: () => IUseControllerBase;
        pokemonController: () => IUseControllerBase;
    } {
        // --- MAPPERS ---
        const generationMapper = FactoryHelper.create<GenerationMapper>(GenerationMapper, deps.logger);

        const pokemonMapper = FactoryHelper.create<PokemonMapper>(PokemonMapper, deps.logger);

        const pokemonViewMapper = FactoryHelper.create<PokemonViewMapper>(PokemonViewMapper, deps.logger);
        
        const navbarMapper = FactoryHelper.create<NavBarMapper>(NavBarMapper, deps.logger);
        
        // --- DATA SOURCES ---
        const dataSourceFactoryInput = [deps.httpClient, deps.httpMapper, deps.logger];
        const generationDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<GenerationDto>>(env, GenerationDataSource, GenerationMockDataSource, ...dataSourceFactoryInput);

        const pokemonDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokemonDto>>(env, PokemonDataSource, PokemonMockDataSource, ...dataSourceFactoryInput);

        const pokemonSpeciesDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokemonSpeciesDto>>(env, PokemonSpeciesDataSource, PokemonSpeciesMockDataSource, ...dataSourceFactoryInput);

        const pokeApiResponseDataSource = FactoryHelper
            .createByEnvHelper<IDataSource<PokeApiResponseDto>>(env, PokeApiResponseDataSource, PokeApiResponseMockDataSource, ...dataSourceFactoryInput);

        // --- REPOSITORIES ---
        const generationRepository = FactoryHelper
            .create<IGenerationRepository>(GenerationRepository, generationDataSource, pokeApiResponseDataSource, pokemonDataSource, generationMapper, pokemonMapper, deps.logger);

        const pokemonRepository = FactoryHelper
            .create<IPokemonRepository>(PokemonRepository, pokemonDataSource, pokemonSpeciesDataSource, pokemonMapper, deps.logger);

        // --- USE CASES ---
        const generationUseCase = FactoryHelper
            .create<IGetGenerationUseCase>(GetGenerationUseCase, generationRepository, deps.logger);

        const pokemonUseCase = FactoryHelper
            .create<IGetPokemonUseCase>(GetPokemonUseCase, generationRepository, deps.logger);

        const pokemonDetailUseCase = FactoryHelper
            .create<IGetPokemonDetailUseCase>(GetPokemonDetailUseCase, pokemonRepository, deps.logger);

        // --- CONTROLLERS ---
        return {
            generationController: () => FactoryHelper
                .create<UseGenerationController>(UseGenerationController, useGenerationStore(), generationUseCase, navbarMapper, deps.logger),
            pokemonController: () => FactoryHelper
                .create<UsePokemonController>(UsePokemonController, usePokegenStore(), pokemonUseCase, pokemonDetailUseCase, pokemonViewMapper, deps.logger),
        }
    }
}
