import { EnvironmentEnum } from "@/app/EnvironmentEnum";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { createByEnvHelper } from "@/core/utils/factories/CreateByEnvHelper";
import { BlobDataSource } from "../data/datasources/BlobDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { BlobMockDataSource } from "../data/datasources/mock/BlobMockDataSource";

/**
 * Factory per la creazione di istanze di IDataSource in base all'ambiente.
 */
export class DataSourceFactory {
    private constructor() {}

    /**
     * Crea un'istanza di IDataSource in base all'ambiente specificato.
     * @param type - Tipo di ambiente (sviluppo o produzione)
     * @param dev - Funzione che crea il DataSource per l'ambiente di sviluppo
     * @param prod - Funzione che crea il DataSource per l'ambiente di produzione
     * @returns Un'istanza di IDataSource
     */
    public static create<T>(env: EnvironmentEnum, deps: { httpClient: IHttpClient, httpMapper: IHttpErrorMapper, logger: ILogger }): IDataSource<T> {
        createByEnvHelper<IDataSource<Blob>>(env, () => new BlobDataSource(deps.httpClient, deps.httpMapper, deps.logger), () => new BlobMockDataSource());
        throw new Error("Tipo di DataSource non supportato");
    }
}