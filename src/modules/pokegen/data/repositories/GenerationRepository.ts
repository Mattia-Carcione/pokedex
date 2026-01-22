import { IGenerationRepository } from "@/modules/pokegen/domain/repositories/IGenerationRepository";
import { Generation } from "@/modules/pokegen/domain/entities/Generation";
import { IGenerationMapperFacade } from "@/modules/pokegen/data/facade/IGenerationMapperFacade";
import { IGenerationDataSourceFacade } from "@/modules/pokegen/data/facade/IGenerationDataSourceFacade";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Repository per gestire i dati delle generazioni Pokémon.
 */
export class GenerationRepository implements IGenerationRepository {
    protected readonly className = "GenerationRepository";

    constructor(
        private readonly ds: IGenerationDataSourceFacade,
        private readonly mapper: IGenerationMapperFacade,
        private readonly logger: ILogger
    ) { }

    /**
     * Recupera una generazione specifica di Pokémon.
     * @param endpoint - L'endpoint da cui recuperare la generazione
     * @returns Una promessa che risolve l'entità Generation corrispondente
     */
    async getAsync(id: string): Promise<Generation> {
        try {
            const data = await this.ds.generationDS.fetchData(id);
            const generation = this.mapper.generationMapper.map(data);
            const task = data.pokemon_species.map(async ({ url }) => {
                const pokemon = await this.ds.pokemonDS.fetchData(url);
                return this.mapper.pokemonMapper.map({ pokemon });
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
            const response = await this.ds.pokeapiDS.fetchData();
            const task = response.results.map(async (resource) => {
                const data = await this.ds.generationDS.fetchData(resource.url);
                return this.mapper.generationMapper.map(data);
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