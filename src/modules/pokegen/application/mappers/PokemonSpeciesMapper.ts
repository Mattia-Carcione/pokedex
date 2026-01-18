import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";
import { PokemonSpecies } from "../../domain/entities/PokemonSpecies";
import { MappingError } from "@/shared/core/errors/MappingError";
import { PokemonSpeciesDTO } from "../../data/models/dtos/PokemonSpeciesDto";

/**
 * Mapper per convertire i dati del Pokémon dal DTO al dominio.
 */
export class PokemonSpeciesMapper implements IMapper<PokemonSpeciesDTO, PokemonSpecies> {
    /**
     * Converte un oggetto PokemonSpeciesDTO in un'entità Pokemon del dominio.
     * @param dto - L'oggetto PokemonSpeciesDTO da convertire.
     * @returns L'entità Pokemon corrispondente.
     */
    toDomain(dto :PokemonSpeciesDTO) : PokemonSpecies {
        if (!dto.id || !dto.name) 
            throw new MappingError<PokemonSpeciesDTO>("Dati del Pokémon Species incompleti", dto);
        
        try {
            return new PokemonSpecies(
                dto.id,
                dto.name,
            );
        } catch (error) {
            throw new MappingError<PokemonSpeciesDTO>("Errore durante la mappatura del Pokémon Species", dto, error as Error);
        }
    }
}