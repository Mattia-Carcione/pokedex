import { useGenerationStore } from "../UseGenerationStore";
import { usePokegenStore } from "../UsePokegenStore";

/**
 * Tipo che rappresenta lo store di generazione dei Pokémon.
 */
export type PokegenStore = ReturnType<typeof usePokegenStore>;

/**
 * Tipo che rappresenta lo store di generazione.
 */
export type GenerationStore = ReturnType<typeof useGenerationStore>;