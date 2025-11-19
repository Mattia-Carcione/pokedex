type Basic = {
    id: number;
    name: string;
}

type NameUrl = {
    name: string;
    url: string;
}

export type CardPokemon = Basic & {
    types: Type[];
    imgSrc: string;
}

export type Type = Basic & {
    imgSrc: string;
    color: string;
}

export type Generation = Basic & {
    href: string;
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