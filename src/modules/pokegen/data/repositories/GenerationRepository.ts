import { IGenerationRepository } from "@/modules/pokegen/domain/repositories/IGenerationRepository";
import { Generation } from "@/modules/pokegen/domain/entities/Generation";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { PokeApiResponseDto } from "../models/dtos/PokeApiResponseDto";
import { IGenerationMapper } from "../../application/mappers/contracts/IGenerationMapper";
import { IPokemonMapper } from "../../application/mappers/contracts/IPokemonMapper";
import { GenerationDto } from "../models/dtos/GenerationDto";
import { PokemonDto } from "../models/dtos/PokemonDto";
import { EndpointApi } from "../enums/EndpointApi";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";

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
        private readonly cache: ICache<Generation | Generation[]>,
        private readonly logger: ILogger
    ) { }

    /**
     * Recupera una generazione specifica di Pokémon.
     * @param endpoint - L'endpoint da cui recuperare la generazione
     * @returns Una promessa che risolve l'entità Generation corrispondente
     */
    async getAsync(id: string): Promise<Generation> {
        this.logger.debug(`[${this.className}] - Inizio del recupero della generazione con ID: ` + id);
        const key = this.cache.generateKey(this.className, "getAsync", id);
        const cached = this.cache.get(key);
        if (cached) {
            this.logger.debug(`[${this.className}] - Generazione trovata nella cache con ID: ` + id);
            return cached as Generation;
        }
        this.logger.debug(`[${this.className}] - Cache miss per ${id}, recupero dati`);
        const data = await this.generationDataSource.fetchData(id);
        const generation = this.generationMapper.map(data);
        const task = data.pokemon_species.map(async ({ url }) => {
            const pokemon = await this.pokemonDataSource.fetchData(url);
            return this.pokemonMapper.map({ pokemon });
        });

        const list = await Promise.all(task);
        generation.pokemon = list.sort((a, b) => a.id - b.id);
        this.cache.set(key, generation, 1000 * 60 * 60);
        return generation;
    }

    /**
     * Recupera tutte le generazioni di Pokémon.
     * @param endpoint - L'endpoint da cui recuperare le generazioni
     * @returns Una promessa che risolve un array di entità Generation
     */
    async getAllAsync(): Promise<Generation[]> {
        this.logger.debug(`[${this.className}] - Inizio del recupero delle generazioni.`);

        const key = this.cache.generateKey(this.className, "getAllAsync", "all_generations");
        const cached = this.cache.get(key);
        if (cached) {
            this.logger.debug(`[${this.className}] - Generazioni trovate nella cache.`);
            return cached as Generation[];
        }

        this.logger.debug(`[${this.className}] - Cache miss per tutte le generazioni, recupero dati.`);
        const response = await this.pokeApiResponseDataSource.fetchData(EndpointApi.Generation);
        const task = response.results.map(async (resource) => {
            const data = await this.generationDataSource.fetchData(resource.url);
            return this.generationMapper.map(data);
        });
        const generations = await Promise.all(task);
        this.cache.set(key, generations, 1000 * 60 * 60);
        return generations;
    }
}
