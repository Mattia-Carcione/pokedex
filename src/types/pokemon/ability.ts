import type { NamedApi } from "../pokeApi";

/**
 * Ability
 *
 * @member is_hidden - Se è un'abilità nascosta (boolean).
 * @member slot - Slot occupato dall'abilità in questa specie (integer).
 * @member ability - Abilità (NamedApi / NamedAPIResource Ability).
 */
export interface Ability {
  is_hidden: boolean;
  slot: number;
  ability: NamedApi;
};