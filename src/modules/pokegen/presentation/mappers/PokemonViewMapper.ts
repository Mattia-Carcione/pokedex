import { MappingError } from "@/core/errors/MappingError";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonViewMapper } from "./contracts/IPokemonViewMapper";
import { AppRouteName } from "@/app/routing/AppRouteName";
import { TYPE_COLORS, TYPE_ICONS } from "@/app/const";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { PokemonVM } from "../viewmodels/types/PokemonVM";

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
        try {
            return {
                ...source,
                height: MathHelper.formatDecimeterValue(source.height),
                weight: MathHelper.formatDecimeterValue(source.weight),
                pokedexNumber: source.id.toString().padStart(3, '0'),
                displayTypes: source.types.map(type => ({
                    color: TYPE_COLORS[type.name],
                    icon: TYPE_ICONS[type.name],
                    name: type.name.charAt(0).toUpperCase() + type.name.slice(1),
                })),
                displayName: source.name.charAt(0).toUpperCase() + source.name.slice(1),
                href: { name: AppRouteName.Pokemon, params: { name: source.name }},
            }
        } catch (error) {
            this.logger.error("[PokemonViewMapper] - Errore durante la mappatura del Pokémon", (error as Error).message);
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
        const pokemon = this.map(source);
        // TODO: Aggiungere ulteriori dettagli specifici per la vista dettaglio
        return pokemon;
    }
}