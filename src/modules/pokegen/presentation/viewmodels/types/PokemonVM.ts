import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * ViewModel rappresentante un Pokémon.
 */
export interface PokemonVM extends Pokemon {
    pokedexNumber: string,
    displayTypes: { color: string; icon: string; name: string }[];
    displayName: string;
    href: { name: string; params: { name: string } };
}