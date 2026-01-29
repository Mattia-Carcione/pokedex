import { IDataSource } from "@/core/contracts/data/IDataSource";
import { ICache } from "@/core/contracts/infrastructure/cache/ICache";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { NotImplementedError } from "@/core/errors/NotImplementedError";
import { NamedResource } from "@/core/types/CommonTypes";
import { PokeApiResponseDto } from "@/modules/pokegen/data/models/dtos/PokeApiResponseDto";
import { IPokeApiRepository } from "@/shared/domain/repositories/IPokeApiRepository";

/**
 * Repository per il PokeApiResponseDto dell'applicazione.
 */
export class PokeApiRepository implements IPokeApiRepository {
    constructor(
        private readonly pokeApiResponseDataSource: IDataSource<PokeApiResponseDto>,
        private readonly cache: ICache<NamedResource[]>,
        private readonly logger: ILogger
    ) { }

    /**
     * Metodo non implementato per recuperare un PokeApiResponseDto.
     * @throws NotImplementedError
     */
    async getAsync(): Promise<NamedResource> {
        throw new NotImplementedError('[PokeApiRepository] - getAsync method is not implemented.');
    }

    /**
     * Recupera tutti i NamedResource dalla PokéAPI.
     * @returns Una promessa che risolve un array di NamedResource
     */
    async getAllAsync(): Promise<NamedResource[]> {
        this.logger.debug(`[PokeApiRepository] - Fetching PokeApiResponseDto`);

        const key = this.cache.generateKey(this.constructor.name, "getAllAsync", "all");
        const cached = this.cache.get(key);
        if (cached) {
            this.logger.debug(`[PokeApiRepository] - PokeApiResponseDto found in cache`);
            return cached;
        }

        this.logger.debug(`[PokeApiRepository] - Cache miss, fetching PokeApiResponseDto`);
        const pokeApiResponseDto = await this.pokeApiResponseDataSource.fetchData();
        this.cache.set(key, pokeApiResponseDto.results, 1000 * 60 * 60);
        return pokeApiResponseDto.results;
    }
}
