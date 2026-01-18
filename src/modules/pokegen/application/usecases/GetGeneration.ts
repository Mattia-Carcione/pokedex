import { Result } from "@/shared/core/interfaces/domain/entities/Result";
import { IResourceListRepository } from "../../domain/repositories/IResourceListRepository";
import { IGetGeneration } from "../../domain/usecases/IGetGeneration";
import { Generation } from "../../domain/entities/Generation";
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository";

/**
 * Use case per recuperare la generazione dei Pokémon.
 */
export class GetGeneration implements IGetGeneration {
    constructor(
        private resourceListRepository: IResourceListRepository,
        private readonly generationRepository: IGenerationRepository
    ) {}

    /**
     * Esegue il use case per ottenere la generazione dei Pokémon.
     * @returns Una promessa che risolve la lista delle generazioni
     */
    async execute(): Promise<Result<Generation[], Error>> {
        try {
            const data = await this.resourceListRepository.get();
            const task = data.results.map(async (resource) => {
                return this.generationRepository.get(resource.url);
            });
            const generation = await Promise.all(task);

            return new Result<Generation[], Error>(true, generation, null);
        } catch (error) {
            return new Result<Generation[], Error>(false, null, error as Error);
        }
    }
}