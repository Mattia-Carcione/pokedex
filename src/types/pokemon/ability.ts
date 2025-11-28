import type { NamedApi } from "../pokeApi";

/**
 * Ability
 *
 * @property is_hidden - Se è un'abilità nascosta (boolean).
 * @property slot - Slot occupato dall'abilità in questa specie (integer).
 * @property ability - Abilità (NamedApi / NamedAPIResource Ability).
 */
export interface Ability {
  is_hidden: boolean;
  slot: number;
  ability: NamedApi;
};