import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";
import { Generation } from "../../domain/entities/Generation";
import { MappingError } from "@/shared/core/errors/MappingError";
import { GenerationDTO } from "../../data/models/dtos/GenerationDto";


/**
 * Mapper per convertire i dati della Generazione Pokémon dal DTO al dominio.
 */
export class GenerationMapper implements IMapper<GenerationDTO, Generation> {
    toDomain(dto: GenerationDTO): Generation {
        if (!dto.id || !dto.name || !dto.pokemon_species) 
            throw new MappingError<GenerationDTO>("Dati della generazione incompleti", dto);
        
        try {
            return new Generation(dto.id, dto.name, dto.pokemon_species);
        } catch (error) {
            throw new MappingError<GenerationDTO>("Errore durante la mappatura della generazione", dto, error as Error);
        }
    }
}