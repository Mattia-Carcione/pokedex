import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";
import { Pokemon } from "../../domain/entities/Pokemon";
import { MappingError } from "@/shared/core/errors/MappingError";
import { PokemonDTO } from "../../data/models/dtos/PokemonDto";

/**
 * Mapper per convertire i dati del Pokémon dal DTO al dominio.
 */
export class PokemonMapper implements IMapper<PokemonDTO, Pokemon> {
    /**
     * Converte un oggetto PokemonDTO in un'entità Pokemon del dominio.
     * @param dto - L'oggetto PokemonDTO da convertire.
     * @returns L'entità Pokemon corrispondente.
     */
    toDomain(dto :PokemonDTO) : Pokemon {
        if (!dto.id || !dto.name || !dto.types || !dto.sprites) 
            throw new MappingError<PokemonDTO>("Dati del Pokémon incompleti", dto);
        
        try {
            return new Pokemon(
                dto.id,
                dto.species.name,
                dto.types.map(t => t.type.name),
                dto.sprites.other?.home.front_default || dto.sprites.front_default ||''
            );
        } catch (error) {
            throw new MappingError<PokemonDTO>("Errore durante la mappatura del Pokémon", dto, error as Error);
        }
    }
}