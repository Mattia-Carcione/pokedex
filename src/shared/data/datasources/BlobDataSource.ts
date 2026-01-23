import { IDataSource } from "@/core/contracts/data/IDataSource";
import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { IHttpErrorMapper } from "@/core/contracts/infrastructure/http/mappers/IHttpErrorMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ExternalServiceUnavailableError } from "@/core/errors/ExternalServiceUnavailableError";
import { HttpError } from "@/infrastructure/http/errors/HttpError";

/**
 * Data source per il recupero di dati Blob (ad esempio immagini) da un endpoint esterno.
 */
export class BlobDataSource implements IDataSource<Blob> {
    private readonly message = "[BlobDataSource] - Errore nel recupero dei dati dell'immagine. ";

    constructor(
        private readonly httpClient: IHttpClient,
        private readonly httpErrorMapper: IHttpErrorMapper,
        private readonly logger: ILogger
    ) {}

    /**
     * Recupera i dati Blob da un endpoint specificato.
     * @param endpoint - L'endpoint da cui recuperare i dati Blob
     * @returns I dati Blob recuperati dall'endpoint
     * @throws ExternalServiceUnavailableError se il servizio esterno non è disponibile
     */
    async fetchData(endpoint: string): Promise<Blob> {
        try {
            const response = await this.httpClient.get<Blob>(endpoint, {
                responseType: 'blob',
            });
            return response;
        } catch (error) {
            this.logger.error(this.message + (error as Error).message);
            if(error instanceof HttpError)
                this.httpErrorMapper.map(error);

            throw new ExternalServiceUnavailableError("Error fetching image data. \n Details: External service unavailable." + (error as Error).message);
        }
    }
}