import { IGenerationRepository } from "@/modules/pokegen/domain/repositories/IGenerationRepository";
import { Generation } from "@/modules/pokegen/domain/entities/Generation";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokeApiResponseDto } from "../models/dtos/PokeApiResponseDto";
import { IGenerationMapper } from "../../application/mappers/contracts/IGenerationMapper";
import { IPokemonMapper } from "../../application/mappers/contracts/IPokemonMapper";
import { GenerationDto } from "../models/dtos/GenerationDto";
import { PokemonDto } from "../models/dtos/PokemonDto";

/**
 * Repository per gestire i dati delle generazioni Pokémon.
 */
export class GenerationRepository implements IGenerationRepository {
    protected readonly className = "GenerationRepository";
    
    constructor(
        private readonly generationDataSource: IDataSource<GenerationDto>,
        private readonly pokeApiResponseDataSource: IDataSource<PokeApiResponseDto>,
        private readonly pokemonDataSource: IDataSource<PokemonDto>,
        private readonly generationMapper: IGenerationMapper,
        private readonly pokemonMapper: IPokemonMapper,
        private readonly logger: ILogger
    ) { }

    /**
     * Recupera una generazione specifica di Pokémon.
     * @param endpoint - L'endpoint da cui recuperare la generazione
     * @returns Una promessa che risolve l'entità Generation corrispondente
     */
    async getAsync(id: string): Promise<Generation> {
        try {
            const data = await this.generationDataSource.fetchData(id);
            const generation = this.generationMapper.map(data);
            const task = data.pokemon_species.map(async ({ url }) => {
                const pokemon = await this.pokemonDataSource.fetchData(url);
                return this.pokemonMapper.map({ pokemon });
            });
            const list = await Promise.all(task);
            generation.pokemon = list.sort((a, b) => a.id - b.id);
            this.logger.debug(`[${this.className}] - Generazione ${generation.name} con ID ${generation.version} recuperata con successo.`);
            return generation;
        } catch (error) {
            this.logger.error(`[${this.className}] - Errore nel recupero della generazione con ID ${id}:`, (error as Error).message);
            throw error;
        }
    }

    /**
     * Recupera tutte le generazioni di Pokémon.
     * @param endpoint - L'endpoint da cui recuperare le generazioni
     * @returns Una promessa che risolve un array di entità Generation
     */
    async getAllAsync(): Promise<Generation[]> {
        try {
            const response = await this.pokeApiResponseDataSource.fetchData();
            const task = response.results.map(async (resource) => {
                const data = await this.generationDataSource.fetchData(resource.url);
                return this.generationMapper.map(data);
            });
            const generations = await Promise.all(task);
            this.logger.debug(`[${this.className}] - Tutte le generazioni recuperate con successo.`, generations);
            return generations;
        } catch (error) {
            this.logger.error(`[${this.className}] - Errore nel recupero delle generazioni:`, (error as Error).message);
            throw error;
        }
    }
}
