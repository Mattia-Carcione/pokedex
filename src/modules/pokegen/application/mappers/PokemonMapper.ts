import { Pokemon } from "../../domain/entities/Pokemon";
import { MappingError } from "@/core/errors/MappingError";
import { IPokemonMapper } from "@/modules/pokegen/application/mappers/contracts/IPokemonMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokemonAggregateData } from "../../data/models/types/PokemonAggregateData";
import { PokemonDto } from "../../data/models/dtos/PokemonDto";
import { PokemonSpeciesDto } from "../../data/models/dtos/PokemonSpeciesDto";
import { DEFAUL_IMAGE } from "@/app/const";
import { ChainLinkDto, EvolutionChainDto } from "../../data/models/dtos/EvolutionChainDto";
import { PokemonEvolution } from "../../domain/types/PokemonEvolution";

/**
 * Mapper per convertire i dati del Pokémon dal Dto al dominio.
 */
export class PokemonMapper implements IPokemonMapper {
    constructor(private readonly logger: ILogger) { }

    /**
     * Converte un oggetto PokemonDto in un'entità Pokemon del dominio.
     * @param Dto - L'oggetto PokemonDto da convertire.
     * @returns L'entità Pokemon corrispondente.
     */
    map(Dto: PokemonAggregateData): Pokemon {
        this.logger.debug("[PokemonMapper] - Inizio della mappatura del Pokémon con ID: " + Dto.pokemon.id);

        const { pokemon, species, evolution, forms } = Dto;

        if (!pokemon.id || !pokemon.name || !pokemon.types || !pokemon.sprites || !pokemon.weight || !pokemon.height || !pokemon.stats)
            throw new MappingError<PokemonDto>("[PokemonMapper] - Error during Pokémon mapping: Missing required properties.", pokemon);

        try {
            const types = pokemon.types.map(t => ({ slot: t.slot, name: t.type.name, url: t.type.url }));

            const entity = new Pokemon(
                pokemon.id,
                pokemon.species.name,
                pokemon.name,
                types.sort((a, b) => a.slot - b.slot),
                pokemon.height,
                pokemon.weight,
                pokemon.stats.map(s => ({ name: s.stat.name, base: s.base_stat })),
                pokemon.sprites.other?.home.front_default ?? pokemon.sprites.front_default ?? DEFAUL_IMAGE
            );

            this.mapSpecies(entity, species);

            this.mapEvolution(entity, evolution);

            if (forms) { }

            return entity;
        } catch (error) {
            throw new MappingError<PokemonAggregateData>("[PokemonMapper] - Error during Pokémon mapping", Dto, error as Error);
        }
    }

    /**
     * Mappa i dati della specie del Pokémon nell'entità Pokemon.
     * @param pokemon  L'entità Pokemon da aggiornare.
     * @param Dto I dati della specie del Pokémon.
     * @returns L'entità Pokemon aggiornata con i dati della specie.
     */
    private mapSpecies(pokemon: Pokemon, dto?: PokemonSpeciesDto): Pokemon {
        if(!dto) return pokemon;
        if (dto.capture_rate === undefined || !dto.genera || !dto.generation || !dto.flavor_text_entries)
            throw new MappingError<PokemonSpeciesDto>("[PokemonMapper] - Error during Pokémon Species mapping: Missing required properties.");

        this.logger.debug("[PokemonMapper] - Inizio della mappatura della specie del Pokémon con ID: " + pokemon.id);

        try {
            pokemon.genus = dto.genera.find((g: any) => g.language.name === "en")?.genus || "";
            pokemon.flavorText = dto.flavor_text_entries
                .filter((entry) => entry.language.name === "en")
                .map((entry) => ({
                    version: entry.version.name,
                    text: entry.flavor_text.replace(/[\n\f]/g, " ")
                }));
            pokemon.captureRate = dto.capture_rate;
            pokemon.generation = dto.generation.name;
            pokemon.genderRate = dto.gender_rate;
            pokemon.varieties = dto.varieties;
            return pokemon;
        } catch (error) {
            throw new MappingError<PokemonSpeciesDto>("[PokemonMapper] - Error during Pokémon Species mapping. " + (error as Error).message);
        }
    }

    /**
     * Mappa la catena evolutiva del Pokémon nell'entità Pokemon.
     * @param pokemon L'entità Pokemon da aggiornare.
     * @param evolution I dati della catena evolutiva del Pokémon.
     * @returns L'entità Pokemon aggiornata con i dati della catena evolutiva.
     */
    private mapEvolution(pokemon: Pokemon, evolution?: EvolutionChainDto): Pokemon {
        if(!evolution) return pokemon;
        if(!evolution.chain) 
            throw new MappingError<EvolutionChainDto>("[PokemonMapper] - Error during Pokémon evolution mapping: Missing required properties.");

        this.logger.debug("[PokemonMapper] - Inizio della mappatura della catena evolutiva del Pokémon con ID: " + pokemon.id);

        try {
            const evolutions: PokemonEvolution[] = [];

            const traverse = (node: ChainLinkDto) => {
                for (const next of node.evolves_to) {
                    for (const detail of next.evolution_details) {
                        evolutions.push({
                            from: node.species.name,
                            to: next.species.name,
                            trigger: detail.trigger.name,
                            minLevel: detail.min_level ?? undefined,
                            item: detail.item?.name,
                            gender: detail.gender,
                            timeOfDay: detail.time_of_day || undefined,
                            needsOverworldRain: detail.needs_overworld_rain || undefined,
                            knownMove: detail.known_move?.name,
                            knownMoveType: detail.known_move_type?.name,
                            location: detail.location?.name,
                            minHappiness: detail.min_happiness ?? undefined,
                            minBeauty: detail.min_beauty ?? undefined,
                            minAffection: detail.min_affection ?? undefined,
                            relativePhysicalStats: detail.relative_physical_stats ?? undefined,
                            partySpecies: detail.party_species?.name,
                            partyType: detail.party_type?.name,
                            tradeSpecies: detail.trade_species?.name,
                            minMoveCount: detail.min_move_count ?? undefined,
                            needsMultiplayer: detail.needs_multiplayer || undefined,
                            turnUpsideDown: detail.turn_upside_down || undefined,
                            usedMove: detail.used_move?.name
                        });
                    }

                    traverse(next);
                }
            };

            traverse(evolution.chain);
            pokemon.evolution = evolutions;
            return pokemon;
        } catch (error) {
            throw new MappingError<EvolutionChainDto>("[PokemonMapper] - Error during Pokémon Evolution mapping. " + (error as Error).message);
        }
    }
}
