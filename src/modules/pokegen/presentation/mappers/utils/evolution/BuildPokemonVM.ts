import { DEFAULT_POKEMON_IMAGE } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";

/**
 * Costruisce un oggetto PokemonVM per la visualizzazione del Pokémon.
 * @param name - Il nome del Pokémon.
 * @param sprite - (Opzionale) L'URL dello sprite del Pokémon.
 * @returns Un oggetto PokemonVM con nome, sprite e link alla pagina del Pokémon.
 */
export function buildPokemonVM(name: string, sprite?: string): { name: string; sprite?: string; href: { name: string; params: { name: string; }; }; } {
    return ({
        name,
        sprite: sprite ?? DEFAULT_POKEMON_IMAGE,
        href: {
            name: PokegenRouteName.Pokemon,
            params: { name }
        }
    });
}