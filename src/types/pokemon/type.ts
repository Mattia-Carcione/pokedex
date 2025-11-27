import type { NamedApi } from "../pokeApi";

/**
 * PokemonType
 *
 * @param slot - Ordine in cui i tipi sono elencati (integer).
 * @param type - Tipo referenziato (NamedApi / NamedAPIResource Type).
 */
export interface Type {
  slot: number | string;
  type: NamedApi;
};