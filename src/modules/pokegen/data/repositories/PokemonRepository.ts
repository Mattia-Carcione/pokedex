import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { PokemonDTO } from "../models/dtos/PokemonDto";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";

/**
 * Repository per gestire i dati dei Pokémon.
 */
export class PokemonRepository implements IPokemonRepository {
    protected readonly className = "PokemonRepository";
    constructor(
        private readonly dataSource: IDataSource<PokemonDTO>,
        private readonly mapper: IMapper<PokemonDTO, Pokemon>
    ) { }

    /**
     * Recupera i dati di un Pokémon specifico.
     * 
     * @param endpoint  - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come Pokemon
     * 
     * @throws Error se il recupero o la mappatura dei dati fallisce
     */
    async get(endpoint: string): Promise<Pokemon> {
        try {
            const data = await this.dataSource.fetchData(endpoint);
            return this.mapper.toDomain(data);
        } catch (error) {
            throw error;
        }
    }
}