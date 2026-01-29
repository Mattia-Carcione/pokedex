import { Result } from "@/core/domain/entities/Result";
import { Pokemon } from "../../domain/entities/Pokemon";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { IGetSearchPokemonUseCase } from "../../domain/usecases/IGetSearchPokemonUseCase";

/**
 * Use case per recuperare i dati di un Pokémon specifico.
 */
export class GetSearchPokemonUseCase implements IGetSearchPokemonUseCase {
    constructor(
        private readonly pokemonRepository: IPokemonRepository,
        private readonly logger: ILogger
    ) { }

    /**
     * Esegue il use case per ottenere i dati del Pokémon.
     * @returns Una promessa che risolve i dati del Pokémon
     */
    async execute(input: string): Promise<Result<Pokemon, Error>> {
        this.logger.debug("[GetSearchPokemonUseCase] - Esecuzione del use case per ottenere i dati del Pokémon con input: " + input);
        try {
            const data = await this.pokemonRepository.getAsync(input);
            return new Result<Pokemon, Error>(true, data, null);
        } catch (error) {
            return new Result<Pokemon, Error>(false, null, error as Error);
        }
    }
}