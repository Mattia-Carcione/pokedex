import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { EnvironmentEnum } from "../EnvironmentEnum";
import { GenerationDataSourceFactory } from "@/modules/pokegen/data/factories/GenerationDataSourceFactory";
import { AxiosClientFactory } from "@/infrastructure/http/client/axios/AxiosClientFactory";
import { BASE_API_URL } from "@/core/costants/BaseApiUrl";
import { HttpErrorMapper } from "@/infrastructure/http/mappers/HttpErrorMapper";
import { GenerationMapper } from "@/modules/pokegen/application/mappers/GenerationMapper";
import { PokemonMapper } from "@/modules/pokegen/application/mappers/PokemonMapper";
import { PokemonDataSourceFactory } from "@/modules/pokegen/data/factories/PokemonDataSourceFactory";
import { ResourceListDataSourceFactory } from "@/modules/pokegen/data/factories/ResourceListDataSourceFactory";
import { GenerationRepository } from "@/modules/pokegen/data/repositories/GenerationRepository";
import { PokemonRepository } from "@/modules/pokegen/data/repositories/PokemonRepository";
import { GetGenerationUseCase } from "@/modules/pokegen/application/usecases/GetGenerationUseCase";
import { GetPokemonUseCase } from "@/modules/pokegen/application/usecases/GetPokemonUseCase";
import { NavBarMapper } from "@/modules/pokegen/presentation/mappers/NavbarMapper";
import { PokemonViewMapper } from "@/modules/pokegen/presentation/mappers/PokemonViewMapper";
import { UseGenerationController } from "@/modules/pokegen/presentation/controllers/UseGenerationController";
import { UsePokemonController } from "@/modules/pokegen/presentation/controllers/UsePokemonController";
import { useGenerationStore } from "@/modules/pokegen/presentation/store/UseGenerationStore";
import { usePokegenStore } from "@/modules/pokegen/presentation/store/UsePokegenStore";
import { RetryEnum } from "@/infrastructure/http/enums/RetryEnum";
import { Logger } from "@/infrastructure/logger/Logger";
import { GetPokemonDetailUseCase } from "@/modules/pokegen/application/usecases/GetPokemonDetailUseCase";
import { PokemonSpeciesDataSourceFactory } from "@/modules/pokegen/data/factories/PokemonSpeciesDataSourceFactory";

/**
 * Container per la gestione delle dipendenze dell'applicazione PokéGen.
 */
class AppContainer {
    readonly generationController: () => IUseControllerBase;
    readonly pokemonController: () =>IUseControllerBase;

    constructor(env: EnvironmentEnum) {
        const logger = new Logger(env);

        // --- INFRASTRUCTURE ---
        const httpFactory = new AxiosClientFactory(logger);
        const httpClient = httpFactory.create(BASE_API_URL, {
          retry: 3,
          retryDelay: 1000,
          jitter: RetryEnum.FULL
        });

        // --- MAPPERS ---
        const httpMapper = new HttpErrorMapper(logger);
        const genMapper = new GenerationMapper(logger);
        const pkmMapper = new PokemonMapper(logger);
        const navbarMapper = new NavBarMapper(logger);
        const pokemonViewMapper = new PokemonViewMapper(logger);

        // --- FACTORIES ---
        const genDsFactory = new GenerationDataSourceFactory(httpClient, httpMapper, logger);
        const pkmDsFactory = new PokemonDataSourceFactory(httpClient, httpMapper, logger);
        const pkmSpeciesDsFactory = new PokemonSpeciesDataSourceFactory(httpClient, httpMapper, logger);
        const resourceListDsFactory = new ResourceListDataSourceFactory(httpClient, httpMapper, logger); 
        
        // --- DATA SOURCES ---
        const genDataSource = genDsFactory.create(env);
        const pkmDataSource = pkmDsFactory.create(env);
        const pkmSpeciesDataSource = pkmSpeciesDsFactory.create(env);
        const resourceListDataSource = resourceListDsFactory.create(env);
        const genDsFacade = { generationDS: genDataSource, pokeapiDS: resourceListDataSource, pokemonDS: pkmDataSource };

        // --- REPOSITORIES ---
        const  genMapperFacade = { generationMapper: genMapper, pokemonMapper: pkmMapper };
        const genRepo = new GenerationRepository(genDsFacade, genMapperFacade, logger);
        const pkmRepo = new PokemonRepository(pkmDataSource, pkmSpeciesDataSource, pkmMapper, logger);

        // --- USE CASES ---
        const genUseCase = new GetGenerationUseCase(genRepo, logger);
        const pkmUseCase = new GetPokemonUseCase(genRepo, logger);
        const pkmDetailUseCase = new GetPokemonDetailUseCase(pkmRepo, logger);

        // --- CONTROLLERS ---
        this.generationController = () => (new UseGenerationController(useGenerationStore(), genUseCase, navbarMapper, logger));
        this.pokemonController = () => (new UsePokemonController(usePokegenStore(), pkmUseCase, pkmDetailUseCase, pokemonViewMapper, logger));
    }
}

/**
 * Istanza del container dell'applicazione PokéGen.
 */
export const appContainer = new AppContainer(
  import.meta.env.DEV
    ? EnvironmentEnum.DEVELOPMENT
    : EnvironmentEnum.PRODUCTION
);