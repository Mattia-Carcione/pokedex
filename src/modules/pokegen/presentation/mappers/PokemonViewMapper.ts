import { MappingError } from "@/core/errors/MappingError";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonViewMapper } from "./contracts/IPokemonViewMapper";
import { AppRouteName } from "@/app/routing/AppRouteName";
import { TYPE_COLORS, TYPE_ICONS } from "@/app/const";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { PokemonVM } from "../viewmodels/types/PokemonVM";
import { mapEvolutionGroupsForView } from "./evolution/MapEvolutionGroupsForView";
import { StringHelper } from "@/core/utils/string/StringHelper";
import { mapEvolutionStagesForView } from "./evolution/MapEvolutionStagesForView";

/**
 * Mapper per convertire i dati del Pokémon in un HomeViewModel.
 */
export class PokemonViewMapper implements IPokemonViewMapper {
    constructor(private readonly logger: ILogger) {}

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
                href: { name: AppRouteName.Pokemon, params: { name: source.nameSpecies }},
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

        if(!source.evolution) return pokemon;
        
        const grouped = mapEvolutionGroupsForView(source);
        pokemon.evolution = mapEvolutionStagesForView(grouped);
        if(pokemon.evolution?.length <= 0) {
            this.logger.warn("[PokemonViewMapper] - Nessuna evoluzione trovata durante la mappatura del dettaglio del Pokémon");
            pokemon.evolution = [{
                pokemons: [{
                    name: pokemon.name,
                    sprite: pokemon.sprite
                }],
                evolutions: []
            }]
        }
        pokemon.height = MathHelper.formatDecimeterValue(source.height);
        pokemon.weight = MathHelper.formatDecimeterValue(source.weight);
        pokemon.stats = source.stats;
        pokemon.flavorText = source.flavorText;
        pokemon.genus = source.genus;

        const [generation, roman] = StringHelper.splitByHyphen(source.generation || '');
        const label = StringHelper.capitalize(generation);
        const generationId = MathHelper.convertToArabicNumber(roman);
        pokemon.generation = { href: {name: AppRouteName.Generation, params: { id: generationId } }, name: `${label} ${roman?.toUpperCase()}` };
        pokemon.genderRate = this.mapGenderRate(source.genderRate || -1);
        pokemon.captureRate = MathHelper.formatPercentageValue(source.captureRate || 0);
        // TODO: Aggiungere ulteriori dettagli specifici per la vista dettaglio
        return pokemon;
    }

    /**
     * Funzione per mappare il tasso di genere del Pokémon
     * @param genderRate (number) il numero di tasso di genere espresso in ottavi
     */
    private mapGenderRate(genderRate: number): { male: number; female: number; } | undefined {
        if(genderRate < 0) return undefined;
        if (genderRate === 0) return { male: 100, female: 0 }
        if (genderRate > 0) {
            const femaleRate = Number(((genderRate / 8) * 100).toFixed(2));
            const maleRate = Number(100 - femaleRate);
            return { male: maleRate, female: femaleRate }
        }
    }
}