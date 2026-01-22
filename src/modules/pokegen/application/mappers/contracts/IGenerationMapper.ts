import { IMapper } from "@/core/contracts/mappers/IMapper";
import { GenerationDTO } from "@/modules/pokegen/data/models/dtos/GenerationDto";
import { Generation } from "@/modules/pokegen/domain/entities/Generation";

/**
 * Mapper per convertire i dati della generazione dal DTO al dominio.
 */
export interface IGenerationMapper extends IMapper<GenerationDTO, Generation> {}