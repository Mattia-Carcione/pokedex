import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokegenApplicationMapperEnum } from "../enums/PokegenApplicationMapperEnum";
import { GenerationMapper } from "../mappers/GenerationMapper";
import { IGenerationMapper } from "../mappers/contracts/IGenerationMapper";
import { IPokemonMapper } from "../mappers/contracts/IPokemonMapper";
import { PokemonMapper } from "../mappers/PokemonMapper";

/**
 * Classe utility per la creazione dei mapper dell'application layer
 */
export class PokegenApplicationMapperFactory {
    private constructor() {}

    /**
     * Metodo per creare l'istanza dei maper dell'application layer
     * @param type [PokegenApplicationMapperEnum] - enum dei mapper presenti in questo layer
     * @param logger [ILogger] - istanza del logger
     * @returns Ritorna l'istanza del mapper desiderato.
     */
    static create(type: PokegenApplicationMapperEnum, logger: ILogger): IGenerationMapper | IPokemonMapper  {
        switch (type) {
            case PokegenApplicationMapperEnum.Generation:
                return new GenerationMapper(logger);
            
            case PokegenApplicationMapperEnum.Pokemon:
                return new PokemonMapper(logger);

            default:
                throw new Error(`PokegenApplicationMapperFactory: tipo non supportato ${type}`);
        }
    }
}
