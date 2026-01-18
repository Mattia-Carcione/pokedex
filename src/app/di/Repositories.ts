import { PokemonDataSource } from "@/modules/pokegen/data/datasources/PokemonDataSource";
import { pokeApiClient } from "../providers/Axios";
import { GenerationDataSource } from "@/modules/pokegen/data/datasources/GenerationDataSource";
import { GenerationRepository } from "@/modules/pokegen/data/repositories/GenerationRepository";
import { PokemonMapper } from "@/modules/pokegen/application/mappers/PokemonMapper";
import { GenerationMapper } from "@/modules/pokegen/application/mappers/GenerationMapper";
import { PokemonRepository } from "@/modules/pokegen/data/repositories/PokemonRepository";
import { PokemonMockDataSource } from "@/modules/pokegen/data/datasources/PokemonMockDataSource";
import { GenerationMockDataSource } from "@/modules/pokegen/data/datasources/GenerationMockDataSource";
import { ResourceListMapper } from "@/modules/pokegen/application/mappers/ResourceListMapper";
import { ResourceListDataSource } from "@/modules/pokegen/data/datasources/ResourceListDataSource";
import { ResourceListRepository } from "@/modules/pokegen/data/repositories/ResourceListRepository";
import { ResourceListMockDataSource } from "@/modules/pokegen/data/datasources/ResourceListMockDataSource";
import { PokemonSpeciesMockDataSource } from "@/modules/pokegen/data/datasources/PokemonSpeciesMockDataSource";
import { PokemonSpeciesDataSource } from "@/modules/pokegen/data/datasources/PokemonSpeciesDataSources";
import { PokemonSpeciesMapper } from "@/modules/pokegen/application/mappers/PokemonSpeciesMapper";
import { PokemonSpeciesRepository } from "@/modules/pokegen/data/repositories/PokemonSpeciesRepository";

const isDev = !import.meta.env.DEV;

const pkmDataSource = isDev ? new PokemonMockDataSource() : new PokemonDataSource(pokeApiClient);
const pkmSpeciesDataSource = isDev ? new PokemonSpeciesMockDataSource() : new PokemonSpeciesDataSource(pokeApiClient);
const genDataSource = isDev ? new GenerationMockDataSource() : new GenerationDataSource(pokeApiClient);
const resourceListDataSource = isDev ? new ResourceListMockDataSource() : new ResourceListDataSource(pokeApiClient);

const pkmMapper = new PokemonMapper();
const pkmSpeciesMapper = new PokemonSpeciesMapper();
const genMapper = new GenerationMapper();
const resourceListMapper = new ResourceListMapper();

/**
 * Provider per i repository dell'applicazione PokéGen.
 */
export const repositories = {
    genRepo: new GenerationRepository(genDataSource, genMapper),
    pkmRepo: new PokemonRepository(pkmDataSource, pkmMapper),
    pkmSpeciesRepo: new PokemonSpeciesRepository(pkmSpeciesDataSource, pkmSpeciesMapper),
    resourceListRepo: new ResourceListRepository(resourceListDataSource, resourceListMapper)
};