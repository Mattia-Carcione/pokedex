import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { Pokemon } from "../../domain/entities/Pokemon";
import { GenerationCollection } from "../../domain/entities/GenerationMap";
import { NamedResource } from "@/shared/core/types/CommonTypes";
import { IResourceListRepository } from "../../domain/repositories/IResourceListRepository";
import { Result } from "@/shared/core/interfaces/domain/entities/Result";
import { IGetPokemonByGeneration } from "../../domain/usecases/IGetPokemonByGeneration";
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository";

/**
 * Use case per recuperare i dati di un Pokémon specifico.
 */
export class GetPokemonByGeneration implements IGetPokemonByGeneration {
    constructor(
        private readonly pokemonRepository: IPokemonRepository,
        private readonly generationRepository: IGenerationRepository,
        private readonly resourceListRepository: IResourceListRepository,
    ) { }

    /**
     * Esegue il use case per ottenere i dati del Pokémon.
     * @returns Una promessa che risolve i dati del Pokémon
     */
    async execute(): Promise<Result<GenerationCollection, Error>> {
        const collection: GenerationCollection = new Map();
        try {
            const entryData = await this.resourceListRepository.get();
            const task = entryData.results.map(async ({url}) => {
                const generation = await this.generationRepository.get(url);
                const pokemon = await this.fetchPokemonData(generation.pokemon);
                collection.set(generation.version, { generationId: generation.version, generationName: generation.name, pokemon });
            });
            await Promise.all(task);
            return new Result<GenerationCollection, Error>(true, collection, null);
        } catch (error) {
            console.error(error);
            return new Result<GenerationCollection, Error>(false, null, error as Error);
        }
    }
    
    /**
     * Recupera i dati dei Pokémon per una lista di risorse nominate.
     * @param pokemonList - La lista di risorse nominate dei Pokémon
     * @returns Una promessa che risolve un array di oggetti Pokémon
     */
    private async fetchPokemonData(pokemonList: NamedResource[]): Promise<Pokemon[]> {
        const task = pokemonList.map(({url}) => {
            const replaceUrl = url.replace('pokemon-species', 'pokemon');
            return this.pokemonRepository.get(replaceUrl);
        });
        return await Promise.all(task);
    }
}