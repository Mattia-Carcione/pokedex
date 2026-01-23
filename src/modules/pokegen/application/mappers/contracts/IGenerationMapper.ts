import { IMapper } from "@/core/contracts/mappers/IMapper";
import { GenerationDto } from "@/modules/pokegen/data/models/dtos/GenerationDto";
import { Generation } from "@/modules/pokegen/domain/entities/Generation";

/**
 * Mapper per convertire i dati della generazione dal Dto al dominio.
 */
export interface IGenerationMapper extends IMapper<GenerationDto, Generation> {}