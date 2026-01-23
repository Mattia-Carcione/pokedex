import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { IGetGenerationUseCase } from "../../domain/usecases/IGetGenerationUseCase";
import { IGetPokemonUseCase } from "../../domain/usecases/IGetPokemonUseCase";
import { IGetPokemonDetailUseCase } from "../../domain/usecases/IGetPokemonDetailUseCase";
import { PokegenUseCaseEnum } from "../enums/PokegenUseCaseEnum";
import { GetGenerationUseCase } from "../usecases/GetGenerationUseCase";
import { GetPokemonUseCase } from "../usecases/GetPokemonUseCase";
import { GetPokemonDetailUseCase } from "../usecases/GetPokemonDetailUseCase";

/**
 * Classe utility per la creazione dei mapper dell'application layer
 */
export class PokegenUseCaseFactory {
    private constructor() {}

    /**
     * Metodo per creare l'istanza degli use case dell'application layer
     * @param type [PokegenUseCaseEnum] - tipo di use case richiesto
     * @param logger [ILogger] - istanza del logger
     * @param generationRepository [IGenerationRepository] - istanza del repository della generazione.
     * @param pokemonRepository [IPokemonRepository] - istande del repository dei pokemon
     * @returns Ritorna l'istanza dello use case desiderato
     */
    static create(type: PokegenUseCaseEnum, logger: ILogger, generationRepository: IGenerationRepository, pokemonRepository: IPokemonRepository): IGetGenerationUseCase | IGetPokemonUseCase | IGetPokemonDetailUseCase {
        switch(type) {
            case PokegenUseCaseEnum.Generation:
                return new GetGenerationUseCase(generationRepository, logger);
            case PokegenUseCaseEnum.Pokemon:
                return new GetPokemonUseCase(generationRepository, logger);
            case PokegenUseCaseEnum.PokemonDetail:
                return new GetPokemonDetailUseCase(pokemonRepository, logger);
            
            default:
                throw new Error(`PokegenUseCaseFactory: tipo non supportato ${type}`)
        }
    }
}
