import { Generation } from "../../domain/entities/Generation";
import { MappingError } from "@/core/errors/MappingError";
import { GenerationDTO } from "../../data/models/dtos/GenerationDto";
import { IGenerationMapper } from "@/modules/pokegen/application/mappers/contracts/IGenerationMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Mapper per convertire i dati della Generazione Pokémon dal DTO al dominio.
 */
export class GenerationMapper implements IGenerationMapper {
    constructor(private readonly logger: ILogger) {}

    /**
     * Mappa un GenerationDTO in un'entità Generation del dominio.
     * @param dto - Il DTO della generazione da mappare
     * @returns L'entità Generation risultante dalla mappatura
     * 
     * @throws MappingError se i dati del DTO sono incompleti o la mappatura fallisce
     */
    map(dto: GenerationDTO): Generation {
        if (!dto.id || !dto.name) {
            this.logger.error("[GenerationMapper] - Errore durante il mapping della generazione. Proprietà richieste mancanti: ", dto);
            throw new MappingError<GenerationDTO>("[GenerationMapper] - Error during generation mapping: missing required properties. ", dto);
        }
        
        try {
            return new Generation(dto.id, dto.name);
        } catch (error) {
            this.logger.error("[GenerationMapper] - Errore durante il mapping della generazione. " + (error as Error).message);
            throw new MappingError<GenerationDTO>("[GenerationMapper] - Error during generation mapping: ", dto, error as Error);
        }
    }
}