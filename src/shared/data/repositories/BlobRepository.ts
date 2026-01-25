import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { NotImplementedError } from "@/core/errors/NotImplementedError";
import { IBlobRepository } from "@/shared/domain/repositories/IBlobRepository";

export class BlobRepository implements IBlobRepository {
    constructor(
        private readonly blobDataSource: IDataSource<Blob>,
        private readonly logger: ILogger
    ) { }

    /**
     * Metodo per recuperare un blob tramite endpoint.
     * @param endpoint L'endpoint da cui recuperare il blob.
     * @returns Una Promise che risolve in un Blob.
     */
    async getAsync(endpoint: string): Promise<Blob> {
        this.logger.debug(`[BlobRepository] - Fetching blob with endpoint ${endpoint}`);

        try {
            const blob = await this.blobDataSource.fetchData(endpoint, { responseType: 'blob' });
            return blob;
        } catch (error) {
            this.logger.error(`[BlobRepository] - Failed to fetch blob with endpoint ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Metodo non implementato per recuperare tutti i blob.
     * @throws NotImplementedError
     */
    async getAllAsync(): Promise<Blob[]> {
        throw new NotImplementedError('[BlobRepository] - getAllAsync method is not implemented.');
    }
}