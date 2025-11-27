import type { BaseApi, NamedApi } from "../pokeApi";
import type { Ability } from "./ability";
import type { Sprite } from "./sprite";
import type { Type } from "./type";

/**
 * Informazioni del singolo Pokemon
 *
 * @extends BaseApi
 * @member abilities - Lista delle abilità che questo Pokémon può avere (Ability[]).
 * @member base_experience - Esperienza base ottenuta sconfiggendo questo Pokémon (integer).
 * @member cries - Collezione di versi/cry (ultima versione e legacy).
 * @member forms - Lista delle forme che questo Pokémon può assumere (NamedApi[]).
 * @member game_indices - Indici dei giochi rilevanti per questo Pokémon per generazione (VersionGameIndex[]).
 * @member height - Altezza del Pokémon in decimetri (integer).
 * @member held_items - Lista di oggetti tenuti da questo Pokémon quando incontrato (PokemonHeldItem[]).
 * @member is_default - Vero se è il Pokémon di default per la specie (boolean).
 * @member location_area_encounters - Link alle aree di incontro con dettagli per versione (string).
 * @member moves - Lista di mosse con dettagli di apprendimento per gruppi di versione (PokemonMove[]).
 * @member order - Ordine per l'ordinamento (integer).
 * @member past_abilities - Abilità che il Pokémon aveva in generazioni passate (PokemonAbilityPast[]).
 * @member past_types - Tipi che il Pokémon aveva in generazioni passate (PokemonTypePast[]).
 * @member species - Specie a cui appartiene il Pokémon (NamedApi).
 * @member sprites - Set di sprite usati per rappresentare il Pokémon (PokemonSprites).
 * @member stats - Lista dei valori base delle statistiche (PokemonStat[]).
 * @member types - Tipi correnti del Pokémon con il relativo slot (PokemonType[]).
 * @member weight - Peso del Pokémon in ettogrammi (integer).
 */
export interface Pokemon extends BaseApi {
  abilities: Ability[]; // list ìAbility
  base_experience: number;
  cries: { latest: string | null; legacy: string | null; };
  forms: NamedApi[]; // list NamedAPIResource (PokemonForm)
  game_indices: { game_index: number, version: NamedApi }[]; // list VersionGameIndex
  height: number;
  held_items: { item: NamedApi, version_details: { rarity: number | null, version: NamedApi }[] }[]; // list PokemonHeldItem
  is_default: boolean;
  location_area_encounters: string;
  moves: { move: NamedApi; version_group_details: VersionGroupDetail[] }[]; // list PokemonMove
  order: number;
  past_abilities: {generation: NamedApi; abilities: (Ability | null)[]}[]; // list PokemonAbilityPast
  past_types: { generation: string, type: Type[] }[]; // list PokemonTypePast
  species: NamedApi; // NamedAPIResource (PokemonSpecies)
  sprites: Sprite;
  stats: { base_stat: number; effort: number; stat: NamedApi; }[]; // list PokemonStat
  types: Type[]; // list PokemonType
  weight: number;
};

interface VersionGroupDetail {
    level_learned_at: number;
    move_learned_method: NamedApi;
    order: number | null;
    version_group: NamedApi;
}
