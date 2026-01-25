import { Result } from "@/core/domain/entities/Result";
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IGetPokemonUseCase } from "../../domain/usecases/IGetPokemonUseCase";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Use case per recuperare i dati di un Pokémon specifico.
 */
export class GetPokemonUseCase implements IGetPokemonUseCase {
    constructor(
        private readonly generationRepository: IGenerationRepository,
        private readonly logger: ILogger
    ) { }

    /**
     * Esegue il use case per ottenere i dati del Pokémon.
     * @returns Una promessa che risolve i dati del Pokémon
     */
    async execute(input: string): Promise<Result<Pokemon[], Error>> {
        this.logger.debug("[GetPokemonUseCase] - Esecuzione del use case per ottenere i dati del Pokémon con input: " + input);
        try {
            const data = await this.generationRepository.getAsync(input);
            return new Result<Pokemon[], Error>(true, data.pokemon, null);
        } catch (error) {
            return new Result<Pokemon[], Error>(false, null, error as Error);
        }
    }
}