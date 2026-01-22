import { useGenerationStore } from "../UseGenerationStore";
import { usePokegenStore } from "../UsePokegenStore";
import { usePokemonStore } from "../UsePokemonStore";

/**
 * Tipo che rappresenta lo store di generazione dei Pokémon.
 */
export type PokegenStore = ReturnType<typeof usePokegenStore>;

/**
 * Tipo che rappresenta lo store di generazione.
 */
export type GenerationStore = ReturnType<typeof useGenerationStore>;

/**
 * Tipo che rappresenta lo store del dettaglio del Pokémon.
 */
export type PokemonStore = ReturnType<typeof usePokemonStore>;