import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { PokemonSpeciesDTO } from "../models/dtos/PokemonSpeciesDto";
import { IHttpClient } from "@/shared/core/interfaces/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/shared/core/errors/ExternalServiceUnavailableError";
import { mapHttpError } from "@/shared/infrastructure/http/errors/MapHttpError";
import { NormalizedHttpError } from "@/shared/infrastructure/http/errors/NormalizedHttpError";

/**
 * Data source per ottenere i dati dei Pokémon.
 */
export class PokemonSpeciesDataSource implements IDataSource<PokemonSpeciesDTO> {
    constructor(
        private readonly httpClient: IHttpClient
    ) {}
    
    /**
     * Recupera i dati del Pokémon da un endpoint specifico.
     * @param endpoint - L'endpoint da cui recuperare i dati del Pokémon
     * @returns Una promessa che risolve i dati del Pokémon tipizzati come PokemonSpeciesDTO
     * 
     * @throws DataSourceError se il recupero dei dati fallisce
     */
    async fetchData(endpoint: string): Promise<PokemonSpeciesDTO> {
        try {
            const response = await this.httpClient.get<PokemonSpeciesDTO>(endpoint);
            return response;
        } catch (error) {
            if(error instanceof NormalizedHttpError)
                mapHttpError(error);

            throw new ExternalServiceUnavailableError("Errore nel recupero dei dati del Pokémon." + " \n Dettagli: " + (error as Error).message);
        }
    }
}