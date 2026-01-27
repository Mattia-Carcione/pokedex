import { safeFetch } from "@/core/utils/async/SafeFetch";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import { INavigationPokemonLoaderService } from "./contracts/INavigationPokemonLoaderService";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { ServiceError } from "@/core/errors/ServiceError";

export class NavigationPokemonLoaderService implements INavigationPokemonLoaderService {
    constructor(
        private readonly repository: IPokemonRepository,
        private readonly logger: ILogger,
    ) {}

    async load(input: Pokemon): Promise<Pokemon[]> {
        this.logger.debug("[NavigationPokemonLoaderService] - Esecuzione del servizio per ottenere i dati per la navigazione pokemon per la card dettaglio: " + input.name);
        try {
            const fetcher = (id: string) => this.repository.getAsync(id);
    
            const [prev, next] = await Promise.all([
                safeFetch<Pokemon>(input.id - 1, fetcher),
                safeFetch<Pokemon>(input.id + 1, fetcher),
            ]);
    
            return [prev, next].filter(Boolean) as Pokemon[];
        } catch (error) {
            throw new ServiceError("[NavigationPokemonLoaderService] - Error during execute load navigation service: " + (error as Error).message, (error as Error))
        }
    }
}
