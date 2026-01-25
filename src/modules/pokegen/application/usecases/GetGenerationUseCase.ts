import { Result } from "@/core/domain/entities/Result";
import { IGetGenerationUseCase } from "../../domain/usecases/IGetGenerationUseCase";
import { Generation } from "../../domain/entities/Generation";
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Use case per recuperare la generazione dei Pokémon.
 */
export class GetGenerationUseCase implements IGetGenerationUseCase {
    constructor(
        private readonly generationRepository: IGenerationRepository,
        private readonly logger: ILogger
    ) {}

    /**
     * Esegue il use case per ottenere la generazione dei Pokémon.
     * @returns Una promessa che risolve la lista delle generazioni
     */
    async execute(): Promise<Result<Generation[], Error>> {
        this.logger.debug("[GetGenerationUseCase] - Esecuzione del use case per ottenere la generazione dei Pokémon.");
        try {
            const data = await this.generationRepository.getAllAsync();
            return new Result<Generation[], Error>(true, data, null);
        } catch (error) {
            return new Result<Generation[], Error>(false, null, error as Error);
        }
    }
}