import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokegenDataSourceTypesEnum } from "../enums/PokegenDataSourceTypesEnum";
import { PokeApiResponseDto } from "../models/dtos/PokeApiResponseDto";
import { PokemonDto } from "../models/dtos/PokemonDto";
import { PokemonSpeciesDto } from "../models/dtos/PokemonSpeciesDto";
import { GenerationDto } from "../models/dtos/GenerationDto";

/**
 * Mapping dei tipi datasource in base all'enum PokegenDataSourceTypesEnum
 */
export type PokegenDataSourceFactoryMappingType = {
  [PokegenDataSourceTypesEnum.Pokemon]: IDataSource<PokemonDto>;
  [PokegenDataSourceTypesEnum.PokemonSpecies]: IDataSource<PokemonSpeciesDto>;
  [PokegenDataSourceTypesEnum.Generation]: IDataSource<GenerationDto>;
  [PokegenDataSourceTypesEnum.PokeApiResponse]: IDataSource<PokeApiResponseDto>;
};

