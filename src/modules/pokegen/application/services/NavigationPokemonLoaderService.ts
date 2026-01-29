import { safeFetch } from "@/core/utils/async/SafeFetch";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { INavigationPokemonLoaderService } from "./contracts/INavigationPokemonLoaderService";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ServiceError } from "@/core/errors/ServiceError";

/**
 * Servizio per il caricamento dei Pokémon per la navigazione.
 */
export class NavigationPokemonLoaderService implements INavigationPokemonLoaderService {
    constructor(
        private readonly repository: IPokemonRepository,
        private readonly logger: ILogger,
    ) {}

    /**
     * Carica i Pokémon adiacenti per la navigazione.
     * @param input Il Pokémon di riferimento per il caricamento.
     */
    async load(input: Pokemon): Promise<Pokemon[]> {
        this.logger.debug("[NavigationPokemonLoaderService] - Esecuzione del servizio per ottenere i dati per la navigazione pokemon per la card dettaglio: " + input.name);
        try {
            const fetcher = (id: string) => this.repository.getAsync(id);
    
            const [prev, next] = await Promise.all([
                (input.id - 1) > 0 ? safeFetch<Pokemon>(fetcher, (input.id - 1).toString()) : undefined,
                safeFetch<Pokemon>(fetcher, (input.id + 1).toString()),
            ]);
    
            return [prev, next].filter(Boolean) as Pokemon[];
        } catch (error) {
            throw new ServiceError("[NavigationPokemonLoaderService] - Error during execute load navigation service: " + (error as Error).message, (error as Error))
        }
    }
}
