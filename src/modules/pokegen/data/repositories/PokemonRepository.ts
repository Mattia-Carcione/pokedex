import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { PokemonDto } from "../models/dtos/PokemonDto";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IMapper } from "@/core/contracts/mappers/IMapper";
import { IDataSource } from "@/core/contracts/data/IDataSource";
import { NotImplementedError } from "@/core/errors/NotImplementedError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokemonSpeciesDto } from "../models/dtos/PokemonSpeciesDto";
import { PokemonAggregateData } from "../models/types/PokemonAggregateData";
import { EvolutionChainDto } from "../models/dtos/EvolutionChainDto";

/**
 * Repository per gestire i dati dei Pokémon.
 */
export class PokemonRepository implements IPokemonRepository {
    protected readonly className = "PokemonRepository";
    constructor(
        private readonly dataSource: IDataSource<PokemonDto>,
        private readonly speciesDataSource: IDataSource<PokemonSpeciesDto>,
        private readonly evolutionDataSource: IDataSource<EvolutionChainDto>,
        private readonly pokemonMapper: IMapper<PokemonAggregateData, Pokemon>,
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
        this.logger.debug(`[${this.className}] - Inizio del recupero dei dati del Pokémon da: ${endpoint}`);

        const pokemon = await this.dataSource.fetchData(endpoint);
        return this.pokemonMapper.map({ pokemon });
    }

    /**
     * Recupera i dettagli completi di un Pokémon specifico.
     * @param name - Il nome del Pokémon di cui recuperare i dettagli
     * @returns Una promessa che risolve l'entità Pokemon con i dettagli completi
     */
    async getDetailAsync(name: string): Promise<Pokemon> {
        this.logger.debug(`[${this.className}] - Inizio del recupero dei dettagli del Pokémon: ${name}`);

        const pokemon = await this.dataSource.fetchData(name);
        const species = await this.speciesDataSource.fetchData(pokemon.id.toString());
        const evolution = await this.evolutionDataSource.fetchData(species.evolution_chain.url);
        return this.pokemonMapper.map({ pokemon, species, evolution });
    }

    /**
     * Metodo non implementato per recuperare tutti i Pokémon.
     * @throws NotImplementedError sempre
     */
    getAllAsync(): Promise<Pokemon[]> {
        throw new NotImplementedError(`[${this.className}] - Method getAllAsync not implemented.`);
    }
}
