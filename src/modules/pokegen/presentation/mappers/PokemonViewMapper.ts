import { MappingError } from "@/core/errors/MappingError";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonViewMapper } from "./contracts/IPokemonViewMapper";
import { AppRouteName } from "@/app/routing/AppRouteName";
import { DEFAUL_IMAGE, TYPE_COLORS, TYPE_ICONS } from "@/app/const";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { PokemonVM } from "../viewmodels/types/PokemonVM";
import { StringHelper } from "@/core/utils/string/StringHelper";
import { PokemonEvolution } from "../../domain/types/PokemonEvolution";
import { EvolutionStageVM, PokemonEvolutionVM } from "../viewmodels/types/EvolutionStageVM";

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
            this.logger.error("[PokemonViewMapper] - Error during mapping of Pokémon: " + (error as Error).message);
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
        try {
            pokemon.height = MathHelper.formatDecimeterValue(source.height);
            pokemon.weight = MathHelper.formatDecimeterValue(source.weight);
            pokemon.stats = source.stats;
            pokemon.flavorText = source.flavorText;
            pokemon.genus = source.genus;
            const [generation, roman] = StringHelper.splitByHyphen(source.generation || '');

            const label = StringHelper.capitalize(generation);
            const generationId = MathHelper.convertToArabicNumber(roman);
            pokemon.generation = { href: { name: AppRouteName.Generation, params: { id: generationId ?? 1 } }, name: `${label} ${roman?.toUpperCase()}` };
            pokemon.genderRate = MathHelper.mapGenderRate(source.genderRate || -1);
            pokemon.captureRate = MathHelper.formatPercentageValue(source.captureRate || 0);

            if (source.evolution)
                pokemon.evolution = this.mapEvolutionToVM(source.evolution);

            // TODO: Aggiungere ulteriori dettagli specifici per la vista dettaglio
            return pokemon;
        } catch (error) {
            this.logger.error("[PokemonViewMapper] - Error during mapping of Pokémon detail: " + (error as Error).message);
            throw new MappingError<Pokemon>("[PokemonViewMapper] - Error during mapping of Pokémon", source, error as Error);
        }
    }

    /**
     * Mappa le evoluzioni del Pokémon in ViewModel.
     * @param evolutions - Le evoluzioni del Pokémon da mappare
     * @returns L'array di PokemonEvolutionVM risultante dalla mappatura
     * @throws MappingError se la mappatura fallisce
     */
    private mapEvolutionToVM(evolutions: PokemonEvolution[]): EvolutionStageVM[] {
        this.logger.debug("[PokemonViewMapper] - Inizio della mappatura dell'evoluzione del pokemon");
        try {
            const buildPokemonVM = (name: string, sprite?: string): { name: string; sprite?: string, href:  { name: string; params: { name: string } }} => ({
                name,
                sprite: sprite ?? DEFAUL_IMAGE,
                href: {
                    name: AppRouteName.Pokemon,
                    params: { name }
                }
            });
            const buildEvolutionVM = (e: PokemonEvolution): PokemonEvolutionVM => ({
                    from: e.from,
                    to: e.to,
                    sprite: e.spriteTo ?? DEFAUL_IMAGE,
                    minLevel: e.minLevel,
                    item: e.item,
                    itemSprite: e.item ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${e.item.toLowerCase()}.png` : undefined,
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
                    usedMove: e.usedMove,
                    href: { name: AppRouteName.Pokemon, params: { name: e.to } }
                }
            );

            const stageMap: Record<string, EvolutionStageVM> = {};

            for (const evo of evolutions) {
                if (!stageMap[evo.from]) {
                    // nuovo stage
                    stageMap[evo.from] = {
                        pokemons: buildPokemonVM(evo.from, evo.spriteFrom ?? DEFAUL_IMAGE),
                        evolutions: []
                    };
                }
                stageMap[evo.from].evolutions!.push(buildEvolutionVM(evo));
            }

            return Object.values(stageMap);
        } catch (error) {
            this.logger.error("[PokemonViewMapper] - Error during mapping evolution to VM: " + (error as Error).message);
            throw error;
        }
    }
}
