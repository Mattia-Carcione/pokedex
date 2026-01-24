import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { IGetBlobUseCase } from "@/shared/domain/usecases/IGetBlobUseCase";

/**
 * Controller per la gestione delle operazioni sui Blob.
 */
export class UseBlobController extends IUseControllerBase {
    constructor(
        private readonly blobUseCase: IGetBlobUseCase,
        private readonly logger: ILogger,
    ) { super(); }

    /**
     * Carica un Blob dato il suo identificativo.
     * @param input L'identificativo del Blob da caricare.
     * @returns Una Promise che risolve con il Blob caricato.
     */
    async loadData(input: string): Promise<Blob> {
        const result = await this.blobUseCase.execute(input);
        if(result.success){
            if(result.data)
                return result.data;
        }

        else if (result.error){
            this.logger.error(`UseBlobController - loadData: ${result.error}`);
            throw new Error(`UseBlobController - loadData: ${result.error}`);
        }
        
        return new Blob();
    }
}