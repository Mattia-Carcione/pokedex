import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { NamedResource } from "@/shared/core/types/CommonTypes";
import { PokeApiResponse } from "@/shared/core/types/ApiTypes";
import { IHttpClient } from "@/shared/core/interfaces/infrastructure/http/IHttpClient";
import { ExternalServiceUnavailableError } from "@/shared/core/errors/ExternalServiceUnavailableError";
import { NormalizedHttpError } from "@/shared/infrastructure/http/errors/NormalizedHttpError";
import { mapHttpError } from "@/shared/infrastructure/http/errors/MapHttpError";

/**
 * Data source per ottenere la lista delle risorse delle generazioni di Pokémon.
 */
export class ResourceListDataSource implements IDataSource<PokeApiResponse<NamedResource>> {
        private readonly BASE_URL = 'https://pokeapi.co/api/v2/generation/';
    
        constructor(
            protected readonly httpClient: IHttpClient
        ) {}
    
        /**
         * Recupera i dati dell'entry point delle generazioni Pokémon.
         * @returns Una promessa che risolve i dati tipizzati come PokeApiResponse<NamedResource>
         * 
         * @throws DataSourceError se il recupero dei dati fallisce
         */
        async fetchData(): Promise<PokeApiResponse<NamedResource>> {
            try {
                const response = await this.httpClient.get<PokeApiResponse<NamedResource>>(this.BASE_URL);
                return response;
            } catch (error) {
                if(error instanceof NormalizedHttpError)
                    mapHttpError(error);
                throw new ExternalServiceUnavailableError("Errore durante il recupero delle risorse iniziali delle generazioni." + " \n Dettagli: " + (error as Error).message);
            }
        }
}