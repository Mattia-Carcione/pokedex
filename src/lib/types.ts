type Ability = {
    ability: Basis;
    is_hidden: boolean;
    slot: number;
}

type OtherSprite = {
    dream_world: string;
    home: string;
    official_artwork: string;
    showdown: string;
}

type VersionGroupDetail = {
    level_learned_at: number;
    move_learned_method: Basis;
    order: number;
    version_group: Basis;
}

type PastAbility = Ability[] & { generation: Basis; };

type Sprite = {
    back_default?: string;
    back_female?: string;
    back_shiny?: string;
    back_shiny_female?: string;
    front_default?: string;
    front_female?: string;
    front_shiny?: string;
    front_shiny_female?: string;
    other: OtherSprite;
    versions: Version;
}

type Stat = {
    base_stat: number;
    effort: number;
    stat: Basis;
}

type Version = {
    generation_i: string;
    generation_ii: string;
    generation_iii: string;
    generation_iv: string;
    generation_v: string;
    generation_vi: string;
    generation_vii: string;
    generation_viii: string;
    generation_ix: string;
}

export type Basis = {
    name: string;
    url: string;
}

export type PokeApi = {
    count: number;
    next: string;
    previous: string;
    results: Basis[];
}

export type Generation = {
    id: number;
    name: string;
    abilities: Basis[];
    main_region: Basis;
    moves: Basis[];
    names: { language: Basis; name: string; }[];
    pokemon_species: Basis[];
    types: Basis[];
    version_groups: Basis[];
}

export type Pokemon = Basis & {
    id: number;
    name: string;
    abilities: Ability[];
    base_experience: number;
    cries: { latest: string; legacy: string; };
    forms: Basis[];
    game_indices: [];
    height: number;
    held_items: [];
    is_default: boolean;
    location_area_encounters: string;
    moves: { move: Basis; version_group_details: VersionGroupDetail[] }[];
    order: number;
    past_abilities: PastAbility[];
    past_types: { generation: string, type: Basis }[];
    species: Basis;
    sprites: Sprite;
    stats: Stat[];
    types: { slot: string, type: Basis }[];
    weight: number;
}

export type PokemonSpecies = {
    id: number;
    name: string;
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
    growth_rate: Basis;
    pokedex_numbers: { entry_number: number; pokedex: Basis; }[];
    egg_groups: Basis[];
    color: Basis;
    shape: Basis;
    evolves_from_species: Basis;
    evolution_chain: string;
    habitat?: Basis;
    generation: Basis;
    names: { language: Basis; name: string; }[];
    pal_park_encounters: { area: Basis; base_score: number; rate: number; }[];
    flavor_text_entries: { flavore_text: string; language: Basis; version: Basis; }[];
    form_descriptions: { description: string; language: Basis; }[];
    genera: { genus: string; language: Basis; }[];
    varieties: { is_default: boolean; pokemon: Basis; }[];
}