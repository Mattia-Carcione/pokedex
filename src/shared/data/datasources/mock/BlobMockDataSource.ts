import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

export class BlobMockDataSource implements IDataSource<Blob> {
    constructor(private readonly logger: ILogger) {}

    private className = "BlobMockDataSource";

    /**
     * Metodo per simulare il recupero di un Blob.
     * @param url - URL del Blob da recuperare.
     * @returns Ritorna una Promise che risolve in un Blob vuoto.
     */
    async fetchData(url: string): Promise<Blob> {
        // Simula un piccolo delay per replicare il comportamento di una chiamata HTTP
        await new Promise(resolve => setTimeout(resolve, 10));
        this.logger.debug(`[${this.className}] - fetchData chiamato con URL: ${url}`);
        // Simula il recupero di un Blob vuoto
        return new Blob();
    }
}