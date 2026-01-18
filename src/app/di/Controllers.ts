import { UsePokemonByGenerationController } from "@/modules/pokegen/presentation/controllers/UsePokemonByGenerationController";
import { usePokegenStore } from "@/modules/pokegen/presentation/store/UsePokegenStore";
import { usecases } from "../di/UseCases";
import { UseGenerationController } from "@/modules/pokegen/presentation/controllers/UseGenerationController";
import { useGenerationStore } from "@/modules/pokegen/presentation/store/UseGenerationStore";
import { UsePokemonDetailController } from "@/modules/pokegen/presentation/controllers/UsePokemonDetailController";
import { usePokemonDetailStore } from "@/modules/pokegen/presentation/store/UsePokemonDetailStore";

/**
 * Factory per i controller dell'applicazione PokéGen.
 * @returns Un oggetto contenente le istanze dei controller.
 */
export const getControllers = () => ({
    genController: new UseGenerationController(useGenerationStore(), usecases.getGeneration),
    pkmByGenController: new UsePokemonByGenerationController(usePokegenStore(), usecases.getPokemonByGeneration),
    pkmDetailController: new UsePokemonDetailController(usePokemonDetailStore(), usecases.getPokemonDetail),
})