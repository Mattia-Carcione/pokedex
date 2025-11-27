import type { BaseApi, NamedApi } from "../pokeApi";

/**
 * Informazioni sulla specie Pokemon
 *
 * @extends BaseApi
 * @member order - Ordine per l'ordinamento delle specie (integer).
 * @member gender_rate - Probabilità che sia femmina in ottavi, o -1 per senza genere (integer).
 * @member capture_rate - Tasso base di cattura (0-255) (integer).
 * @member base_happiness - Felicità base all'ottenimento (0-255) (integer).
 * @member is_baby - Se è un Pokémon baby (boolean).
 * @member is_legendary - Se è leggendario (boolean).
 * @member is_mythical - Se è mitico (boolean).
 * @member hatch_counter - Contatore di schiusa (integer).
 * @member has_gender_differences - Se ha differenze visive di genere (boolean).
 * @member forms_switchable - Se ha forme intercambiabili (boolean).
 * @member growth_rate - Tasso di crescita (GrowthRate).
 * @member pokedex_numbers - Lista di numeri e Pokédex dove compare (PokemonSpeciesDexEntry[]).
 * @member egg_groups - Gruppi d'uovo di appartenenza (NamedApi[]).
 * @member color - Colore per ricerca Pokédex (NamedApi).
 * @member shape - Forma per ricerca Pokédex (NamedApi).
 * @member evolves_from_species - Specie da cui evolve (NamedApi).
 * @member evolution_chain - Catena evolutiva (string, APIResource).
 * @member habitat - Habitat dove può essere incontrato (NamedApi|undefined).
 * @member generation - Generazione di introduzione (NamedApi).
 * @member names - Nomi in diverse lingue (Name[]).
 * @member pal_park_encounters - Incontri in Pal Park (PalParkEncounterArea[]).
 * @member flavor_text_entries - Testi descrittivi/Flavor text (FlavorText[]).
 * @member form_descriptions - Descrizioni delle forme (Description[]).
 * @member genera - Genere localizzato in più lingue (Genus[]).
 * @member varieties - Varietà esistenti nella specie (PokemonSpeciesVariety[]).
 */
export interface PokemonSpecies extends BaseApi {
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: NamedApi; // NamedAPIResource (GrowthRate)
  pokedex_numbers: { entry_number: number; pokedex: NamedApi; }[]; // list PokemonSpeciesDexEntry
  egg_groups: NamedApi[]; // list NamedAPIResource (EggGroup)
  color: NamedApi; // NamedAPIResource (PokemonColor)
  shape: NamedApi; // NamedAPIResource (PokemonShape)
  evolves_from_species: NamedApi | null; // NamedAPIResource (PokemonSpecies)
  evolution_chain: string; // APIResource (EvolutionChain)
  habitat?: NamedApi; // NamedAPIResource (PokemonHabitat)
  generation: NamedApi; // NamedAPIResource (Generation)
  names: { language: NamedApi; name: string; }[]; // list Name
  pal_park_encounters: { area: NamedApi; base_score: number; rate: number; }[]; // list PalParkEncounterArea
  flavor_text_entries:  { flavore_text: string; language: NamedApi; version: NamedApi; }[]; // list FlavorText
  form_descriptions: { description: string; language: NamedApi; }[]; // list Description
  genera: { genus: string; language: NamedApi; }[]; // list Genus
  varieties: { is_default: boolean; pokemon: NamedApi; }[]; // list PokemonSpeciesVariety
};