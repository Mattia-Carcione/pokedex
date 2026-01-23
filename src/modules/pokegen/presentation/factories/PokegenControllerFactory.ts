import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokegenControllerEnum } from "../enums/PokegenControllerEnum";
import { IGetPokemonUseCase } from "../../domain/usecases/IGetPokemonUseCase";
import { IGetPokemonDetailUseCase } from "../../domain/usecases/IGetPokemonDetailUseCase";
import { IGetGenerationUseCase } from "../../domain/usecases/IGetGenerationUseCase";
import { IPokemonViewMapper } from "../mappers/contracts/IPokemonViewMapper";
import { INavbarMapper } from "../mappers/contracts/INavbarMapper";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { UsePokemonController } from "../controllers/UsePokemonController";
import { UseGenerationController } from "../controllers/UseGenerationController";

/**
 * Classe utility per la creazione delle istanze dei controller
 */
export class PokegenControllerFactory {
    private constructor() {}

    /**
     * Metodo per la creazione delle istanze dei controller
     * @param type [PokegenControllerEnum] - tipo di controller richiesto
     * @param deps [{pokegenStore: PokegenStore, generationStore: GenerationStore, generationUseCase: IGetGenerationUseCase, pokemonUseCase: IGetPokemonUseCase, navbarViewMapper: INavbarMapper, pokemonViewMapper: IPokemonViewMapper, logger: ILogger}] - oggetto contenente le dipendenze dei controller
     * @returns Ritorna l'istanza del controller desiderata.
     */
    static create(
        type: PokegenControllerEnum, 
        deps: {
            pokegenStore: any,
            generationStore: any,
            generationUseCase: IGetGenerationUseCase,
            pokemonUseCase: IGetPokemonUseCase,
            pokemonDetailUseCase: IGetPokemonDetailUseCase,
            navbarViewMapper: INavbarMapper,
            pokemonViewMapper: IPokemonViewMapper,
            logger: ILogger
        }): () => IUseControllerBase {
        switch(type) {
            case PokegenControllerEnum.Generation:
                return () => new UseGenerationController(deps.generationStore(), deps.generationUseCase , deps.navbarViewMapper, deps.logger);
            case PokegenControllerEnum.Pokemon:
                return () => new UsePokemonController(deps.pokegenStore(), deps.pokemonUseCase, deps.pokemonDetailUseCase, deps.pokemonViewMapper, deps.logger);

            default:
                throw new Error(`PokegenControllerFactory: tipo non supportato ${type}`)
        }
    }
}
