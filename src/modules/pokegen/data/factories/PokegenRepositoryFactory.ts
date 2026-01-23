import { GenerationRepository } from "../repositories/GenerationRepository";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { GenerationDto } from "../models/Dtos/GenerationDto";
import { PokeApiResponseDto } from "../models/Dtos/PokeApiResponseDto";
import { PokemonDto } from "../models/Dtos/PokemonDto";
import { IGenerationMapper } from "../../application/mappers/contracts/IGenerationMapper";
import { IPokemonMapper } from "../../application/mappers/contracts/IPokemonMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokegenRepositoryEnum } from "../enums/PokegenRepositoryEnum";
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { PokemonRepository } from "../repositories/PokemonRepository";
import { PokemonSpeciesDto } from "../models/Dtos/PokemonSpeciesDto";

/**
 * Classe per la creazione delle istanze dei repository della feature pokegen
 */
export class PokegenRepositoryFactory {
    private constructor() {}

    /**
     * Metodo per la creazione dei repository in base al tipo richiesto.
     * @param type [PokegenRepositoryEnum] - Tipo dell'enum.
     * @param deps [{ generationDataSource: IDataSource<GenerationDto>; PokeApiResponseDataSource: IDataSource<PokeApiResponseDto>; pokemonDataSource: IDataSource<PokemonDto>; pokemonSpeciesDataSource: IDataSource<PokemonSpeciesDto>; GenerationMapper: IGenerationMapper; pokemonMapper: IPokemonMapper; logger: ILogger; }] - Dipendenze dei repository richiesti.
     * @returns Ritorna il repository in base al PokegenRepositoryEnum richiesto.
     */
    static create(type: PokegenRepositoryEnum, deps: {
        generationDataSource: IDataSource<GenerationDto>;
        PokeApiResponseDataSource: IDataSource<PokeApiResponseDto>;
        pokemonDataSource: IDataSource<PokemonDto>;
        pokemonSpeciesDataSource: IDataSource<PokemonSpeciesDto>;
        generationMapper: IGenerationMapper;
        pokemonMapper: IPokemonMapper;
        logger: ILogger;
    }): IGenerationRepository | IPokemonRepository  {
        switch (type) {
            case PokegenRepositoryEnum.Generation: 
                return new GenerationRepository(
                    deps.generationDataSource, 
                    deps.PokeApiResponseDataSource, 
                    deps.pokemonDataSource, 
                    deps.generationMapper, 
                    deps.pokemonMapper, 
                    deps.logger
                );

            case PokegenRepositoryEnum.Pokemon:
                return new PokemonRepository(
                    deps.pokemonDataSource, 
                    deps.pokemonSpeciesDataSource, 
                    deps.pokemonMapper, 
                    deps.logger
                );

            default:
                throw new Error(`PokegenRepositoryFactory: tipo non supportato ${type}`);
        }
    }
}
