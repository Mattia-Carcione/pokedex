import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { Result } from "@/core/domain/entities/Result";
import { NamedResource } from "@/core/types/CommonTypes";
import { IPokeApiRepository } from "@/shared/domain/repositories/IPokeApiRepository";
import { IGetPokeApiUseCase } from "@/shared/domain/usecases/IGetPokeApiUseCase";

/**
 * Use case per recuperare un array di NamedResource.
 */
export class GetPokeApiUseCase implements IGetPokeApiUseCase {
    constructor(
        private readonly pokeApiRepository: IPokeApiRepository,
        private readonly logger: ILogger,
    ) {};

    /**
     * Esegue il use case per recuperare un array di NamedResource.
     * @returns Una Promise che risolve in un Result contenente un array di NamedResource o un errore.
     */
    async execute(): Promise<Result<NamedResource[], Error>> {
        this.logger.debug(`[GetPokeApiUseCase] - Esecuzione del use case per recuperare un array di NamedResource`);
        
        try {
            const data = await this.pokeApiRepository.getAllAsync();
            return new Result<NamedResource[], Error>(true, data, null);
        } catch (error) {
            return new Result<NamedResource[], Error>(false, null, error as Error);
        }
    }
}