import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository";
import { GenerationDTO } from "../models/dtos/GenerationDto";
import { Generation } from "../../domain/entities/Generation";

/**
 * Repository per gestire i dati delle generazioni Pokémon.
 */
export class GenerationRepository implements IGenerationRepository {
    protected readonly className = "GenerationRepository";

    constructor(
        private readonly dataSource: IDataSource<GenerationDTO>,
        private readonly mapper: IMapper<GenerationDTO, Generation>,
    ) { }

    /**
     * Recupera una generazione specifica di Pokémon.
     * @param endpoint - L'endpoint da cui recuperare la generazione
     * @returns Una promessa che risolve l'entità Generation corrispondente
     */
    async get(endpoint: string): Promise<Generation> {
        try {
        const data = await this.dataSource.fetchData(endpoint);
        return this.mapper.toDomain(data);
        } catch (error) {
            throw error;
        }
    }
}