import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { IMapper } from "@/core/contracts/mappers/IMapper";
import { PokemonAggregateData } from "@/modules/pokegen/data/models/types/PokemonAggregateData";

/**
 * Mapper per convertire i dati del Pokémon dal Dto al dominio.
 */
export interface IPokemonMapper extends IMapper<PokemonAggregateData, Pokemon> {}