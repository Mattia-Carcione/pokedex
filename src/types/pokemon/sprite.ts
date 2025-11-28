/**
 * Sprite del Pokémon
 *
 * @property front_default - Sprite frontale di default (string).
 * @property front_shiny - Sprite frontale shiny (string).
 * @property front_female - Sprite frontale femminile (string).
 * @property front_shiny_female - Sprite frontale shiny femminile (string).
 * @property back_default - Sprite posteriore di default (string).
 * @property back_shiny - Sprite posteriore shiny (string).
 * @property back_female - Sprite posteriore femminile (string).
 * @property back_shiny_female - Sprite posteriore shiny femminile (string).
 * @property other - Sprite posteriore shiny femminile (string).
 * @property versions - Sprite posteriore shiny femminile (string).
 */
export interface Sprite extends Basis, DetailSprite {
    other: { dream_world: DreamWorldSprite; home: HomeSprite; official_artwork: Basis; showdown: DetailSprite; };
    versions: Version;
};

interface Basis {
    front_default: string;
    front_shiny: string;
}

interface DreamWorldSprite {
    front_default: string | null;
    front_female: string | null;
}

interface HomeSprite extends Basis, DetailSprite {
    back_shiny_female: string | null;
}

interface DetailSprite extends Basis {
    back_default: string;
    back_shiny: string;
    back_female: string | null;
    front_female: string | null;
    front_shiny_female: string | null;
}

interface Version {
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