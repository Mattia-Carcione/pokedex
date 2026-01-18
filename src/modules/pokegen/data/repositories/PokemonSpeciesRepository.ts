import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { IPokemonSpeciesRepository } from "../../domain/repositories/IPokemonSpeciesRepository";
import { PokemonSpeciesDTO } from "../models/dtos/PokemonSpeciesDto";
import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";
import { PokemonSpecies } from "../../domain/entities/PokemonSpecies";

/**
 * Repository per gestire i dati dei Pokémon.
 */
export class PokemonSpeciesRepository implements IPokemonSpeciesRepository {
    protected readonly className = "PokemonSpeciesRepository";
    constructor(
        private readonly dataSource: IDataSource<PokemonSpeciesDTO>,
        private readonly mapper: IMapper<PokemonSpeciesDTO, PokemonSpecies>,
    ) { }

    /**
     * Recupera i dati di un Pokémon specifico.
     * 
     * @param endpoint  - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come Pokemon
     * 
     * @throws Error se il recupero o la mappatura dei dati fallisce
     */
    async get(endpoint: string): Promise<PokemonSpecies> {
        try {
            const data = await this.dataSource.fetchData(endpoint);
            return this.mapper.toDomain(data);
        } catch (error) {
            throw error;
        }
    }
}