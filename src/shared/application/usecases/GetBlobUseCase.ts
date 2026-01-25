import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { Result } from "@/core/domain/entities/Result";
import { IBlobRepository } from "@/shared/domain/repositories/IBlobRepository";
import { IGetBlobUseCase } from "@/shared/domain/usecases/IGetBlobUseCase";

/**
 * Use case per recuperare un blob.
 */
export class GetBlobUseCase implements IGetBlobUseCase {
    constructor(
        private readonly blobRepository: IBlobRepository,
        private readonly logger: ILogger,
    ) {};

    /**
     * Esegue il use case per recuperare un blob.
     * @param input L'endpoint da cui recuperare il blob.
     * @returns Una Promise che risolve in un Result contenente il Blob o un errore.
     */
    async execute(input: string): Promise<Result<Blob, Error>> {
        this.logger.debug("[GetBlobUseCase] - Esecuzione del use case per recuperare un blob da: " + input);
        
        try {
            const blob = await this.blobRepository.getAsync(input);
            return new Result<Blob, Error>(true, blob, null);
        } catch (error) {
            return new Result<Blob, Error>(false, null, error as Error);
        }
    }
}