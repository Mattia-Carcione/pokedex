import { Result } from "@/core/domain/entities/Result";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IGetPokemonDetailUseCase } from "../../domain/usecases/IGetPokemonDetailUseCase";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";

/**
 * Use case per recuperare i dati di un Pokémon specifico.
 */
export class GetPokemonDetailUseCase implements IGetPokemonDetailUseCase {
    private readonly message = "[GetPokemonDetailUseCase] - Errore durante il recupero dei dati del Pokémon: ";
    constructor(
        private readonly pokemonRepository: IPokemonRepository,
        private readonly logger: ILogger
    ) { }

    /**
     * Esegue il use case per ottenere i dati del Pokémon.
     * @returns Una promessa che risolve i dati del Pokémon
     */
    async execute(input: string): Promise<Result<Pokemon[], Error>> {
        try {
            const data = await this.pokemonRepository.getDetailAsync(input);
            this.logger.debug("[GetPokemonDetailUseCase] - Dati del Pokémon recuperati con successo", data);
            return new Result<Pokemon[], Error>(true, [data], null);
        } catch (error) {
            this.logger.error(this.message + (error as Error).message);
            return new Result<Pokemon[], Error>(false, null, error as Error);
        }
    }
}