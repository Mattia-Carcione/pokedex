import { MappingError } from "@/core/errors/MappingError";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonViewMapper } from "./contracts/IPokemonViewMapper";
import { AppRouteName } from "@/app/routing/AppRouteName";
import { TYPE_COLORS, TYPE_ICONS } from "@/app/const";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { PokemonVM } from "../viewmodels/types/PokemonVM";
import { StringHelper } from "@/core/utils/string/StringHelper";
import { PokemonEvolution } from "../../domain/types/PokemonEvolution";
import { EvolutionStageVM } from "../viewmodels/types/EvolutionStageVM ";

/**
 * Mapper per convertire i dati del Pokémon in un HomeViewModel.
 */
export class PokemonViewMapper implements IPokemonViewMapper {
    constructor(private readonly logger: ILogger) { }

    /**
     * Mappa un array di entità Pokemon in un HomeViewModel.
     * @param source - L'array di entità Pokemon da mappare
     * @returns L'oggetto HomeViewModel risultante dalla mappatura
     * @throws MappingError se la mappatura fallisce
     */
    map(source: Pokemon): PokemonVM {
        this.logger.debug(`[PokemonViewMapper] - Inizio della mappatura del Pokémon: ${source.name} (ID: ${source.id})`);

        try {
            return {
                id: source.id.toString(),
                sprite: source.sprite,
                pokedexNumber: StringHelper.applyPadding(source.id.toString(), 3, '0'),
                types: source.types.map(type => ({
                    color: TYPE_COLORS[type.name],
                    icon: TYPE_ICONS[type.name],
                    name: StringHelper.capitalize(type.name),
                })),
                name: StringHelper.capitalize(source.name),
                href: { name: AppRouteName.Pokemon, params: { name: source.nameSpecies } },
            }
        } catch (error) {
            throw new MappingError<Pokemon>("[PokemonViewMapper] - Error during mapping of Pokémon", source, error as Error);
        }
    }

    /**
     * Mappa un array di entità Pokemon in un PokemonVM.
     * @param source - L'array di entità Pokemon da mappare
     * @returns L'oggetto PokemonVM risultante dalla mappatura
     * @throws MappingError se la mappatura fallisce
     */
    mapDetail(source: Pokemon): PokemonVM {
        this.logger.debug("[PokemonViewMapper] - Inizio della mappatura del dettaglio del Pokémon");
        const pokemon = this.map(source);

        pokemon.height = MathHelper.formatDecimeterValue(source.height);
        pokemon.weight = MathHelper.formatDecimeterValue(source.weight);
        pokemon.stats = source.stats;
        pokemon.flavorText = source.flavorText;
        pokemon.genus = source.genus;
        const [generation, roman] = StringHelper.splitByHyphen(source.generation || '');
        const label = StringHelper.capitalize(generation);
        const generationId = MathHelper.convertToArabicNumber(roman);
        pokemon.generation = { href: { name: AppRouteName.Generation, params: { id: generationId } }, name: `${label} ${roman?.toUpperCase()}` };
        pokemon.genderRate = MathHelper.mapGenderRate(source.genderRate || -1);
        pokemon.captureRate = MathHelper.formatPercentageValue(source.captureRate || 0);

        if (source.evolution)
            pokemon.evolution = this.buildEvolutionVM(source.evolution);

        // TODO: Aggiungere ulteriori dettagli specifici per la vista dettaglio
        return pokemon;
    }

    private buildEvolutionVM(evolutions: PokemonEvolution[]): EvolutionStageVM[] {
        const stages: EvolutionStageVM[] = [];

        const mapByFrom = new Map<string, PokemonEvolution[]>();
        evolutions.forEach(e => {
            if (!mapByFrom.has(e.from)) mapByFrom.set(e.from, []);
            mapByFrom.get(e.from)!.push(e);
        });

        const visited = new Set<string>();

        const traverse = (fromName: string): EvolutionStageVM[] => {
            if (visited.has(fromName)) return [];
            visited.add(fromName);

            const currentEvolutions = mapByFrom.get(fromName) || [];
            const currentStage: EvolutionStageVM = {
                pokemons: currentEvolutions.length > 0
                    ? [{ name: fromName, sprite: currentEvolutions[0].spriteFrom, href: { name: AppRouteName.Pokemon, params: { name: fromName } } }]
                    : [{ name: fromName, sprite: undefined, href: { name: AppRouteName.Pokemon, params: { name: fromName } } }]
            };

            if (currentEvolutions.length > 0) {
                currentStage.evolutions = currentEvolutions.map(e => ({
                    from: e.from,
                    to: e.to,
                    sprite: e.spriteTo!,
                    minLevel: e.minLevel,
                    item: e.item,
                    href: { name: AppRouteName.Pokemon, params: { name: e.to } },
                    itemSprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${e.item?.toLowerCase()}.png`,
                    gender: e.gender?.toString(),
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
                    usedMove: e.usedMove
                }));

                currentStage.evolutions.forEach(ev => {
                    stages.push(...traverse(ev.to));
                });
            }

            stages.push(currentStage);
            return [currentStage];
        };

        // prendi il primo Pokémon come root (da evolution[0].from)
        traverse(evolutions[0].from);

        return stages;
    }

}
