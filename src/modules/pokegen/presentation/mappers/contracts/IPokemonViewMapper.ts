import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { IMapper } from "@/core/contracts/mappers/IMapper";
import { PokemonVM } from "../../viewmodels/types/PokemonVM";

/**
 * Interfaccia per il mapper della vista del Pokémon.
 */
export interface IPokemonViewMapper extends IMapper<Pokemon, PokemonVM> {
    /**
     * Mappa un array di entità Pokemon in un PokemonVM.
     * @param source - L'array di entità Pokemon da mappare
     * @returns L'oggetto PokemonVM risultante dalla mappatura
     */
    mapDetail(source: Pokemon): PokemonVM;
}