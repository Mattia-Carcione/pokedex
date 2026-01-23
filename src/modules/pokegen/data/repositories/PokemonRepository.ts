import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { PokemonDto } from "../models/dtos/PokemonDto";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IMapper } from "@/core/contracts/mappers/IMapper";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { NotImplementedError } from "@/core/errors/NotImplementedError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokemonSpeciesDto } from "../models/dtos/PokemonSpeciesDto";
import { PokemonAggregateData } from "../models/types/PokemonAggregateData";

/**
 * Repository per gestire i dati dei Pokémon.
 */
export class PokemonRepository implements IPokemonRepository {
    protected readonly className = "PokemonRepository";
    constructor(
        private readonly dataSource: IDataSource<PokemonDto>,
        private readonly speciesDataSource: IDataSource<PokemonSpeciesDto>,
        private readonly mapper: IMapper<PokemonAggregateData, Pokemon>,
        private readonly logger: ILogger
    ) { }

    /**
     * Recupera i dati di un Pokémon specifico.
     * 
     * @param endpoint  - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come Pokemon
     * 
     * @throws Error se il recupero o la mappatura dei dati fallisce
     */
    async getAsync(endpoint: string): Promise<Pokemon> {
        try {
            const data = await this.dataSource.fetchData(endpoint);
            this.logger.debug(`[${this.className}] - Dati del Pokémon recuperati con successo da: ${endpoint}`, data);
            return this.mapper.map({ pokemon: data });
        } catch (error) {
            this.logger.error(`[${this.className}] - Errore nel recupero dei dati del Pokémon da: ${endpoint}`, (error as Error).message);
            throw error;
        }
    }

    async getDetailAsync(name: string): Promise<Pokemon> {
        try {
            const pokemon = await this.dataSource.fetchData(name);
            const species = await this.speciesDataSource.fetchData(name);
            return this.mapper.map({ pokemon, species});
        } catch (error) {
            this.logger.error(`[${this.className}] - Errore nel recupero dei dettagli del Pokémon: ${name}`, (error as Error).message);
            throw error;
        }
    }

    /**
     * Metodo non implementato per recuperare tutti i Pokémon.
     * @throws NotImplementedError sempre
     */
    getAllAsync(): Promise<Pokemon[]> {
        throw new NotImplementedError(`[${this.className}] - Method getAllAsync not implemented.`);
    }
}
