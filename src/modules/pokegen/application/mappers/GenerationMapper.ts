import { Generation } from "../../domain/entities/Generation";
import { MappingError } from "@/core/errors/MappingError";
import { GenerationDto } from "../../data/models/dtos/GenerationDto";
import { IGenerationMapper } from "@/modules/pokegen/application/mappers/contracts/IGenerationMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Mapper per convertire i dati della Generazione Pokémon dal Dto al dominio.
 */
export class GenerationMapper implements IGenerationMapper {
    constructor(private readonly logger: ILogger) {}

    /**
     * Mappa un GenerationDto in un'entità Generation del dominio.
     * @param Dto - Il Dto della generazione da mappare
     * @returns L'entità Generation risultante dalla mappatura
     * 
     * @throws MappingError se i dati del Dto sono incompleti o la mappatura fallisce
     */
    map(Dto: GenerationDto): Generation {
        this.logger.debug("[GenerationMapper] - Inizio della mappatura della generazione con ID: " + Dto.id);
        
        if (!Dto.id || !Dto.name)
            throw new MappingError<GenerationDto>("[GenerationMapper] - Error during generation mapping: missing required properties. ", Dto);
        
        try {
            return new Generation(Dto.id, Dto.name);
        } catch (error) {
            throw new MappingError<GenerationDto>("[GenerationMapper] - Error during generation mapping: ", Dto, error as Error);
        }
    }
}