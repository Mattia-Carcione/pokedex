import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { NotImplementedError } from "@/core/errors/NotImplementedError";
import { IBlobRepository } from "@/shared/domain/repositories/IBlobRepository";

/**
 * Repository per gestire i blob dell'applicazione.
 */
export class BlobRepository implements IBlobRepository {
    constructor(
        private readonly blobDataSource: IDataSource<Blob>,
        private readonly cache: ICache<Blob>,
        private readonly logger: ILogger
    ) { }

    /**
     * Metodo per recuperare un blob tramite endpoint.
     * @param endpoint L'endpoint da cui recuperare il blob.
     * @returns Una Promise che risolve in un Blob.
     */
    async getAsync(endpoint: string): Promise<Blob> {
        this.logger.debug(`[BlobRepository] - Fetching blob with endpoint ${endpoint}`);

        const key = this.cache.generateKey(this.constructor.name, "getAsync", endpoint);
        const cached = this.cache.get(key);
        if (cached) {
            this.logger.debug(`[BlobRepository] - Blob found in cache for endpoint ${endpoint}`);
            return cached;
        }

        this.logger.debug(`[BlobRepository] - Cache miss for ${endpoint}, fetching blob`);
        const blob = await this.blobDataSource.fetchData(endpoint, { responseType: 'blob' });
        this.cache.set(key, blob, 1000 * 60 * 60);
        return blob;
    }

    /**
     * Metodo non implementato per recuperare tutti i blob.
     * @throws NotImplementedError
     */
    async getAllAsync(): Promise<Blob[]> {
        throw new NotImplementedError('[BlobRepository] - getAllAsync method is not implemented.');
    }
}
