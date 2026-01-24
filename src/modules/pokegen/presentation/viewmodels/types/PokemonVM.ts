/**
 * ViewModel rappresentante un Pokémon.
 */
export interface PokemonVM {
    id: string;
    sprite: string;
    height: number;
    weight: number;
    stats: { name: string; base: number }[];
    pokedexNumber: string,
    types: { color: string; icon: string; name: string }[];
    name: string;
    href: { name: string; params: { name: string } };
    genderRate?: number;
    flavorText?: { version: string; text: string }[];
    captureRate?: number;
    generation?: string;
    genus?: string;
}