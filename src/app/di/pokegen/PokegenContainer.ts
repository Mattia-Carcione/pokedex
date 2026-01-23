import { EnvironmentEnum } from "../../EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { PokemonViewMapper } from "@/modules/pokegen/presentation/mappers/PokemonViewMapper";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { useGenerationStore } from "@/modules/pokegen/presentation/store/UseGenerationStore";
import { usePokegenStore } from "@/modules/pokegen/presentation/store/UsePokegenStore";
import { NavBarMapper } from "@/modules/pokegen/presentation/mappers/NavbarMapper";
import { PokegenDataSourceFactory } from "@/modules/pokegen/data/factories/PokegenDataSourceFactory";
import { PokegenDataSourceTypesEnum } from "@/modules/pokegen/data/enums/PokegenDataSourceTypesEnum";
import { PokegenRepositoryFactory } from "@/modules/pokegen/data/factories/PokegenRepositoryFactory";
import { PokegenRepositoryEnum } from "@/modules/pokegen/data/enums/PokegenRepositoryEnum";
import { IGenerationRepository } from "@/modules/pokegen/domain/repositories/IGenerationRepository";
import { IPokemonRepository } from "@/modules/pokegen/domain/repositories/IPokemonRepository";
import { PokegenApplicationMapperFactory } from "@/modules/pokegen/application/factories/PokegenApplicationMapperFactory";
import { PokegenApplicationMapperEnum } from "@/modules/pokegen/application/enums/PokegenApplicationMapperEnum";
import { IPokemonMapper } from "@/modules/pokegen/application/mappers/contracts/IPokemonMapper";
import { IGenerationMapper } from "@/modules/pokegen/application/mappers/contracts/IGenerationMapper";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { PokegenUseCaseFactory } from "@/modules/pokegen/application/factories/PokegenUseCaseFactory";
import { PokegenUseCaseEnum } from "@/modules/pokegen/application/enums/PokegenUseCaseEnum";
import { IGetGenerationUseCase } from "@/modules/pokegen/domain/usecases/IGetGenerationUseCase";
import { IGetPokemonUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonUseCase";
import { IGetPokemonDetailUseCase } from "@/modules/pokegen/domain/usecases/IGetPokemonDetailUseCase";
import { PokegenControllerFactory } from "@/modules/pokegen/presentation/factories/PokegenControllerFactory";
import { PokegenControllerEnum } from "@/modules/pokegen/presentation/enums/PokegenControllerEnum";
import { PokegenPresentationMapperEnum } from "@/modules/pokegen/presentation/enums/PokegenPresentationMapperEnum";
import { PokegenPresentationMapperFactory } from "@/modules/pokegen/presentation/factories/PokegenPresentationMapperFactory";
import { DataSourceFactory } from "@/shared/factories/DataSourceFactory";

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
        const generationMapper = PokegenApplicationMapperFactory
            .create(PokegenApplicationMapperEnum.Generation, deps.logger) as IGenerationMapper;

        const pokemonMapper = PokegenApplicationMapperFactory
            .create(PokegenApplicationMapperEnum.Pokemon, deps.logger) as IPokemonMapper;

        const pokemonViewMapper = PokegenPresentationMapperFactory
            .create(PokegenPresentationMapperEnum.Pokemon, deps.logger) as PokemonViewMapper;
        
        const navbarMapper = PokegenPresentationMapperFactory
            .create(PokegenPresentationMapperEnum.Navbar, deps.logger) as NavBarMapper;
        
        // --- DATA SOURCES ---
        const generationDataSource = PokegenDataSourceFactory
            .create<PokegenDataSourceTypesEnum.Generation>(env, PokegenDataSourceTypesEnum.Generation, deps);

        const pokemonDataSource = PokegenDataSourceFactory
            .create<PokegenDataSourceTypesEnum.Pokemon>(env, PokegenDataSourceTypesEnum.Pokemon, deps);

        const pokemonSpeciesDataSource = PokegenDataSourceFactory
            .create<PokegenDataSourceTypesEnum.PokemonSpecies>(env, PokegenDataSourceTypesEnum.PokemonSpecies, deps);

        const PokeApiResponseDataSource = PokegenDataSourceFactory
            .create<PokegenDataSourceTypesEnum.PokeApiResponse>(env, PokegenDataSourceTypesEnum.PokeApiResponse, deps);

        const blobDataSource = DataSourceFactory.create(env, deps);

        // --- REPOSITORIES ---
        const repositoryInput = { generationDataSource, PokeApiResponseDataSource, pokemonDataSource, pokemonSpeciesDataSource, blobDataSource, generationMapper, pokemonMapper, logger: deps.logger };

        const generationRepository = PokegenRepositoryFactory
            .create(PokegenRepositoryEnum.Generation, repositoryInput) as IGenerationRepository;

        const pokemonRepository = PokegenRepositoryFactory
            .create(PokegenRepositoryEnum.Pokemon, repositoryInput) as IPokemonRepository;

        // --- USE CASES ---
        const generationUseCase = PokegenUseCaseFactory
            .create(PokegenUseCaseEnum.Generation, deps.logger, generationRepository, pokemonRepository) as IGetGenerationUseCase;

        const pokemonUseCase = PokegenUseCaseFactory
            .create(PokegenUseCaseEnum.Pokemon, deps.logger, generationRepository, pokemonRepository) as IGetPokemonUseCase;

        const pokemonDetailUseCase = PokegenUseCaseFactory
            .create(PokegenUseCaseEnum.PokemonDetail, deps.logger, generationRepository, pokemonRepository) as IGetPokemonDetailUseCase;

        const controllerInput = { pokegenStore: usePokegenStore, generationStore: useGenerationStore, generationUseCase: generationUseCase, pokemonUseCase: pokemonUseCase, pokemonDetailUseCase: pokemonDetailUseCase, navbarViewMapper: navbarMapper, pokemonViewMapper: pokemonViewMapper, logger: deps.logger };

        return {
            generationController: PokegenControllerFactory
            .create(
                PokegenControllerEnum.Generation, controllerInput
            ),
            pokemonController: PokegenControllerFactory
            .create(
                PokegenControllerEnum.Pokemon, controllerInput
            ),
        }
    }
}
