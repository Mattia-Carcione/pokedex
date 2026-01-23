import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokegenPresentationMapperEnum } from "../enums/PokegenPresentationMapperEnum";
import { INavbarMapper } from "../mappers/contracts/INavbarMapper";
import { IPokemonViewMapper } from "../mappers/contracts/IPokemonViewMapper";
import { NavBarMapper } from "../mappers/NavbarMapper";
import { PokemonViewMapper } from "../mappers/PokemonViewMapper";

/**
 * Classe di utlity per la creazione delle istanze dei mappers presenti nello strato presentation
 */
export class PokegenPresentationMapperFactory {
    private constructor() {}

    /**
     * Metodo per la creazione delle istanze dei controller
     * @param type [PokegenPresentationMapperEnum] - tipo di mapper desiderato
     * @param logger [ILogger] - istanza del logger
     * @returns Ritorna l'istanza del mapper desiderato
     */
    static create(type: PokegenPresentationMapperEnum, logger: ILogger): INavbarMapper | IPokemonViewMapper {
        switch (type) {
            case PokegenPresentationMapperEnum.Navbar:
                return new NavBarMapper(logger);
            case PokegenPresentationMapperEnum.Pokemon:
                return new PokemonViewMapper(logger);
            default: 
                throw new Error(`PokegenPresentationMapperFactory: tipo non supportato ${type}`)
        }
    }
}
