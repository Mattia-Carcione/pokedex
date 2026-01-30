import { PokemonEvolution } from "@/modules/pokegen/domain/types/PokemonEvolution";
import { PokemonEvolutionVM } from "../../../viewmodels/types/EvolutionStageVM";
import { DEFAULT_POKEMON_IMAGE } from "@/modules/pokegen/presentation/config/PokegenAssets";
import { pokemonGenderMap } from "../../../enums/PokemonGendereMap";
import { PokegenRouteName } from "@/modules/pokegen/presentation/routing/PokegenRouteName";

/**
 * Costruisce un oggetto PokemonEvolutionVM per la visualizzazione dell'evoluzione del Pokémon.
 * @param e - L'oggetto PokemonEvolution da convertire.
 * @returns Un oggetto PokemonEvolutionVM con i dettagli dell'evoluzione.
 */
export function buildEvolutionVM(e: PokemonEvolution): PokemonEvolutionVM {
    return ({
        from: e.from,
        to: e.to,
        sprite: e.spriteTo ?? DEFAULT_POKEMON_IMAGE,
        minLevel: e.minLevel,
        item: e.item,
        itemSprite: e.item ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${e.item.toLowerCase()}.png` : undefined,
        gender: pokemonGenderMap[e.gender ?? 0],
        timeOfDay: e.timeOfDay,
        needsOverworldRain: e.needsOverworldRain,
        knownMove: e.knownMove,
        knownMoveType: e.knownMoveType,
        location: e.location,
        minHappiness: e.minHappiness,
        minBeauty: e.minBeauty,
        minAffection: e.minAffection,
        relativePhysicalStats: e.relativePhysicalStats,
        partySpecies: e.partySpecies,
        partyType: e.partyType,
        tradeSpecies: e.tradeSpecies,
        minMoveCount: e.minMoveCount,
        needsMultiplayer: e.needsMultiplayer,
        turnUpsideDown: e.turnUpsideDown,
        usedMove: e.usedMove,
        href: { name: PokegenRouteName.Pokemon, params: { name: e.to } }
    });
}