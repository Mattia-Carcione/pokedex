import { StringHelper } from "@/core/utils/string/StringHelper";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { PokemonEvolution } from "@/modules/pokegen/domain/types/PokemonEvolution";

/**
 * Imposta le evoluzioni del Pokémon.
 * @param source L'entità Pokemon da cui estrarre le evoluzioni.
 * @returns Un array di oggetti rappresentanti le evoluzioni del Pokémon.
 */
export function mapEvolutionGroupsForView(source: Pokemon): { from: string; evolution: PokemonEvolution[] }[] {
    const map = new Map<string, PokemonEvolution[]>();
    const evolution = source.evolution?.map(evo => ({ ...evo, to: StringHelper.capitalize(evo.to) }));
    
    evolution?.forEach(evo => {
        if (!map.has(evo.from)) map.set(evo.from, []);
        map.get(evo.from)!.push(evo)
    });

    return Array.from(map.entries()).map(([from, evols]) => ({ from, evolution: evols }));
}