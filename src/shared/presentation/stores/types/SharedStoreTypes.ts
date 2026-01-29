import { usePokeApiStore } from "../UsePokeApiStore";

/**
 * Tipo che rappresenta lo store di generazione.
 */
export type PokeApiStore = ReturnType<typeof usePokeApiStore>;