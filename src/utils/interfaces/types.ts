export type NameUrl = {
    name: string;
    url: string;
}

type Basic = {
    id: number;
    name: string;
}

type Gen = {
    generation: NameUrl;
}

type Ability = {
    ability?: NameUrl;
    is_hidden: boolean;
    slot: number;
}

type Cries = {
    latest: string;
    legacy?: string;
}

type Form = NameUrl;

type VersionGroupDetail = {
    level_learned_at: number;
    move_learned_method: NameUrl;
    order: number;
    version_group: NameUrl;
}

type Move = {
    move: NameUrl;
    version_group_details: VersionGroupDetail[]
}

type PastAbility = Ability[] & Gen;

type TypeBasic = {
    type: NameUrl;
}

type CompleteType = TypeBasic & {
    slot: number;
}

type PastType = Gen & TypeBasic;

type Specie = NameUrl;

type OtherSprite = {
    dream_world: any;
    home: any;
    official_artwork: any;
    showdown: any;
}

type Version = {
    generation_i: any;
    generation_ii: any;
    generation_iii: any;
    generation_iv: any;
    generation_v: any;
    generation_vi: any;
    generation_vii: any;
    generation_viii: any;
    generation_ix: any;
}

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
    stat: NameUrl;
}

type NameLang = {
    language: NameUrl;
    name: string;
}

export type CardPokemon = Basic & {
    displayName: string;
    types: Type[];
    imgSrc: string;
}

export type Type = Basic & {
    imgSrc: string;
    color: string;
}

export type Generation = {
    count: number;
    results: NameUrl[];
}

export type GenerationCard = Generation & Basic & {
    href: string;
}

export type GenerationInfo = Basic & {
    abilities: NameUrl[];
    main_region: NameUrl;
    moves: NameUrl[];
    names: NameLang[];
    pokemon_species: NameUrl[];
    types: NameUrl[];
    version_group: NameUrl[];
}

export type Pokemon = Basic & NameUrl & {
    abilities: Ability[];
    base_experience: number;
    cries: Cries;
    forms: Form[];
    game_indices: [];
    height: number;
    held_items: [];
    is_default: boolean;
    location_area_encounters: string;
    moves: Move[];
    order: number;
    past_abilities: PastAbility[];
    past_types: PastType[];
    species: Specie;
    sprites: Sprite;
    stats: Stat[];
    types: CompleteType[];
    weight: number;
}

type PokedexNumber = {
    entry_number: number;
    pokedex: NameUrl;
}

type PalParkEncounterArea = {
    area: NameUrl;
    base_score: number;
    rate: number;
}

type FlavorText = {
    flavore_text: string;
    language: NameUrl;
    version: NameUrl;
}

type Description = {
    description: string;
    language: NameUrl;
}

type Genus = {
    genus: string;
    language: NameUrl;
}

type Variety = {
    is_default: boolean;
    pokemon: NameUrl;
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
    growth_rate: NameUrl;
    pokedex_numbers: PokedexNumber[];
    egg_groups: NameUrl[];
    color: NameUrl;
    shape: NameUrl;
    evolves_from_species: NameUrl;
    evolution_chain: string;
    habitat?: NameUrl;
    generation: NameUrl;
    names: NameLang[];
    pal_park_encounters: PalParkEncounterArea[];
    flavor_text_entries: FlavorText[];
    form_descriptions: Description[];
    genera: Genus[];
    varieties: Variety[];
}