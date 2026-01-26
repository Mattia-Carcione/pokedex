import { EvolutionDetail } from "@/modules/pokegen/data/models/types/EvolutionNode";
import { PokemonEvolution } from "@/modules/pokegen/domain/types/PokemonEvolution";

/**
 * Mappa i dettagli delle evoluzioni in oggetti PokemonEvolution.
 * @param result L'array di oggetti contenenti le informazioni sulle evoluzioni.
 * @returns Un array di oggetti PokemonEvolution.
 */
export function mapEvolutionDetails(result: {
    from: string;
    to: string;
    details: EvolutionDetail[];
}[],
    spritesMap: Record<string, string>): PokemonEvolution[] {
    return (result || []).map(evo => {
        const detail = evo.details[0]; // prendi il primo dettaglio se ce ne sono più di uno
        return {
            from: evo.from,
            to: evo.to,
            fromSprite: spritesMap[evo.from],
            toSprite: spritesMap[evo.to],
            trigger: detail?.trigger?.name || "",
            minLevel: detail?.min_level || undefined,
            item: detail?.item?.name || undefined,
            gender: detail?.gender ?? undefined,
            timeOfDay: detail?.time_of_day || undefined,
            needsOverworldRain: detail?.needs_overworld_rain ?? undefined,
            knownMove: detail?.known_move?.name || undefined,
            location: detail?.location?.name || undefined,
            knownMoveType: detail?.known_move_type?.name || undefined,
            minHappiness: detail?.min_happiness || undefined,
            minBeauty: detail?.min_beauty || undefined,
            minAffection: detail?.min_affection || undefined,
            relativePhysicalStats: detail?.relative_physical_stats || undefined,
            partySpecies: detail?.party_species?.name || undefined,
            partyType: detail?.party_type?.name || undefined,
            tradeSpecies: detail?.trade_species?.name || undefined,
            minMoveCount: detail?.min_move_count || undefined,
            needsMultiplayer: detail?.needs_multiplayer || undefined,
            turnUpsideDown: detail?.turn_upside_down || undefined,
            usedMove: detail?.used_move?.name || undefined,
        };
    });
}