import { DEFAUL_IMAGE } from "@/app/const";
import { AppRouteName } from "@/app/routing/AppRouteName";

/**
 * Costruisce un oggetto PokemonVM per la visualizzazione del Pokémon.
 * @param name - Il nome del Pokémon.
 * @param sprite - (Opzionale) L'URL dello sprite del Pokémon.
 * @returns Un oggetto PokemonVM con nome, sprite e link alla pagina del Pokémon.
 */
export function buildPokemonVM(name: string, sprite?: string): { name: string; sprite?: string; href: { name: string; params: { name: string; }; }; } {
    return ({
        name,
        sprite: sprite ?? DEFAUL_IMAGE,
        href: {
            name: AppRouteName.Pokemon,
            params: { name }
        }
    });
}