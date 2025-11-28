import type { BaseApi, NamedApi } from "../pokeApi";
import type { Ability } from "./ability";
import type { Sprite } from "./sprite";
import type { Type } from "./type";

/**
 * Informazioni del singolo Pokemon
 *
 * @extends BaseApi
 * @property abilities - Lista delle abilità che questo Pokémon può avere (Ability[]).
 * @property base_experience - Esperienza base ottenuta sconfiggendo questo Pokémon (integer).
 * @property cries - Collezione di versi/cry (ultima versione e legacy).
 * @property forms - Lista delle forme che questo Pokémon può assumere (NamedApi[]).
 * @property game_indices - Indici dei giochi rilevanti per questo Pokémon per generazione (VersionGameIndex[]).
 * @property height - Altezza del Pokémon in decimetri (integer).
 * @property held_items - Lista di oggetti tenuti da questo Pokémon quando incontrato (PokemonHeldItem[]).
 * @property is_default - Vero se è il Pokémon di default per la specie (boolean).
 * @property location_area_encounters - Link alle aree di incontro con dettagli per versione (string).
 * @property moves - Lista di mosse con dettagli di apprendimento per gruppi di versione (PokemonMove[]).
 * @property order - Ordine per l'ordinamento (integer).
 * @property past_abilities - Abilità che il Pokémon aveva in generazioni passate (PokemonAbilityPast[]).
 * @property past_types - Tipi che il Pokémon aveva in generazioni passate (PokemonTypePast[]).
 * @property species - Specie a cui appartiene il Pokémon (NamedApi).
 * @property sprites - Set di sprite usati per rappresentare il Pokémon (PokemonSprites).
 * @property stats - Lista dei valori base delle statistiche (PokemonStat[]).
 * @property types - Tipi correnti del Pokémon con il relativo slot (PokemonType[]).
 * @property weight - Peso del Pokémon in ettogrammi (integer).
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
