import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { UseBlobController } from "../presentation/controllers/UseBlobController";
import { FactoryHelper } from "@/core/utils/factories/FactoryHelper";
import { BlobRepository } from "../data/repositories/BlobRepository";
import { GetBlobUseCase } from "../application/usecases/GetBlobUseCase";
import { BlobDataSource } from "../data/datasources/BlobDataSource";
import { BlobMockDataSource } from "../data/datasources/mock/BlobMockDataSource";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { InMemoryCache } from "@/infrastructure/cache/InMemoryCache";

/**
 * Classe factory per la creazione di controller e dipendenze condivise.
 */
export class SharedContainer {
    private constructor() {}

    /**
     * Crea e restituisce un oggetto contenente i controller
     * @param env L'ambiente di esecuzione.
     * @param deps Le dipendenze necessarie per la creazione dei controller.
     * @returns Un oggetto contenente i controller relativi ai Blob.
     */
    static build(env: EnvironmentEnum, deps: {
        httpClient: IHttpClient;
        httpMapper: IHttpErrorMapper;
        logger: ILogger;
    }): { blobController: () => IUseControllerBase, cache: ICache<any> } {
        const cache: ICache<any> = FactoryHelper.create(InMemoryCache);

        const blobDataSource = FactoryHelper.createByEnvHelper<IDataSource<Blob>>(env, BlobDataSource, BlobMockDataSource, deps.httpClient, deps.httpMapper, deps.logger);
        
        const blobRepository = FactoryHelper.create(BlobRepository, blobDataSource, cache, deps.logger);

        const blobUseCase = FactoryHelper.create(GetBlobUseCase, blobRepository, deps.logger);

        return {
            blobController: () => FactoryHelper.create(UseBlobController, blobUseCase, deps.logger),
            cache: cache
        }
    }
}
