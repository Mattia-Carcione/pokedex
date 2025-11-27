/**
 * Sprite del Pokémon
 *
 * @member front_default - Sprite frontale di default (string).
 * @member front_shiny - Sprite frontale shiny (string).
 * @member front_female - Sprite frontale femminile (string).
 * @member front_shiny_female - Sprite frontale shiny femminile (string).
 * @member back_default - Sprite posteriore di default (string).
 * @member back_shiny - Sprite posteriore shiny (string).
 * @member back_female - Sprite posteriore femminile (string).
 * @member back_shiny_female - Sprite posteriore shiny femminile (string).
 * @member other - Sprite posteriore shiny femminile (string).
 * @member versions - Sprite posteriore shiny femminile (string).
 */
export interface Sprite {
    front_default: string;
    front_shiny: string;
    front_female: string | null;
    front_shiny_female: string | null;
    back_default: string;
    back_shiny: string;
    back_female: string | null;
    back_shiny_female: string | null;
    other: { dream_world: string; home: string; official_artwork: string; showdown: string; };
    versions: Version;
};

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