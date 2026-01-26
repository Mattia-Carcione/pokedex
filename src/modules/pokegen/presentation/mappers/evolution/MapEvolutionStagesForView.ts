import { PokemonEvolution } from "@/modules/pokegen/domain/types/PokemonEvolution";
import { EvolutionStageVM, PokemonEvolutionVM, pokemonGenderMap } from "../../viewmodels/types/EvolutionStageVM ";
import { StringHelper } from "@/core/utils/string/StringHelper";

/**
 * Mappa le fasi di evoluzione per la vista.
 * @param source L'array di oggetti rappresentanti le evoluzioni del Pokémon.
 * @returns Un array di EvolutionStageVM rappresentanti le fasi di evoluzione.
 */
export function mapEvolutionStagesForView(
    source: { from: string; evolution: PokemonEvolution[] }[]
): EvolutionStageVM[] {
    const stages: EvolutionStageVM[] = [];
    if (!source || source.length === 0) return stages;

    // -----------------------------
    // STAGE 0: Pokémon base
    // -----------------------------
    stages.push({
        pokemons: [{
            name: StringHelper.capitalize(source[0].from ?? ""),
            sprite: source[0].evolution?.[0]?.fromSprite ?? "" // prendo lo sprite dal primo evo, fallback a stringa vuota
        }]
    });

    // -----------------------------
    // STAGE 1+: evoluzioni
    // -----------------------------
    source.forEach(stageSource => {
        if (stageSource.evolution?.length) {
            const uniqueNames = [...new Set(stageSource.evolution.map(e => e.to))];

            stages.push({
                pokemons: uniqueNames.map(name => ({
                    name,
                    sprite: stageSource.evolution.find(e => e.to === name)?.toSprite ?? ""
                })),
                evolutions: stageSource.evolution.map(mapEvolutions)
            });
        }
    });

    return stages;
}

/**
 * Mappa un oggetto PokemonEvolution in un oggetto PokemonEvolutionVM.
 * @param evo L'oggetto PokemonEvolution da mappare.
 * @returns L'oggetto PokemonEvolutionVM corrispondente.
 */
function mapEvolutions(evo: PokemonEvolution): PokemonEvolutionVM {
    return {
        from: evo.from,
        to: evo.to,
        fromSprite: evo.fromSprite ?? "",
        toSprite: evo.toSprite ?? "",
        minLevel: evo.minLevel,
        item: evo.item,
        gender: pokemonGenderMap[evo.gender ?? 0],
        timeOfDay: evo.timeOfDay,
        needsOverworldRain: evo.needsOverworldRain,
        knownMove: evo.knownMove,
        location: evo.location,
        knownMoveType: evo.knownMoveType,
        minHappiness: evo.minHappiness,
        minBeauty: evo.minBeauty,
        minAffection: evo.minAffection,
        relativePhysicalStats: evo.relativePhysicalStats,
        partySpecies: evo.partySpecies,
        partyType: evo.partyType,
        tradeSpecies: evo.tradeSpecies,
        minMoveCount: evo.minMoveCount,
        needsMultiplayer: evo.needsMultiplayer,
        turnUpsideDown: evo.turnUpsideDown,
        usedMove: evo.usedMove,
    };
}
