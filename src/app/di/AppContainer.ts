import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { EnvironmentEnum } from "../EnvironmentEnum";
import { AxiosClientFactory } from "@/infrastructure/http/client/axios/AxiosClientFactory";
import { BASE_API_URL } from "@/core/costants/BaseApiUrl";
import { HttpErrorMapper } from "@/infrastructure/http/mappers/HttpErrorMapper";
import { RetryEnum } from "@/infrastructure/http/enums/RetryEnum";
import { Logger } from "@/infrastructure/logger/Logger";import { PokegenContainer } from "./pokegen/PokegenContainer";

/**
 * Container per la gestione delle dipendenze dell'applicazione PokéGen.
 */
class AppContainer {
    readonly generationController: () => IUseControllerBase;
    readonly pokemonController: () =>IUseControllerBase;

    constructor(env: EnvironmentEnum) {
      // --- LOGGERS ---
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

      const { generationController, pokemonController } = PokegenContainer.build(env, {httpClient, httpMapper, logger});

      this.generationController = generationController;
      this.pokemonController = pokemonController;
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
