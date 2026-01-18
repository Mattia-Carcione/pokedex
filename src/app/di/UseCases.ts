import { GetPokemonByGeneration } from "@/modules/pokegen/application/usecases/GetPokemonByGeneration";
import { repositories } from "./Repositories";
import { GetGeneration } from "@/modules/pokegen/application/usecases/GetGeneration";
import { GetPokemonDetail } from "@/modules/pokegen/application/usecases/GetPokemonDetail";

/**
 * Provider per i casi d'uso dell'applicazione PokéGen.
 */
export const usecases = {
    getGeneration: new GetGeneration(repositories.resourceListRepo, repositories.genRepo),
    getPokemonByGeneration: new GetPokemonByGeneration(repositories.pkmRepo, repositories.genRepo, repositories.resourceListRepo),
    getPokemonDetail: new GetPokemonDetail(repositories.pkmRepo, repositories.pkmSpeciesRepo),
}