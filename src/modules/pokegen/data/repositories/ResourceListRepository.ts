import { IResourceListRepository } from "../../domain/repositories/IResourceListRepository";
import { NamedResource } from "@/shared/core/types/CommonTypes";
import { PokeApiResponse } from "@/shared/core/types/ApiTypes";
import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";
import { ResourceList } from "@/modules/pokegen/domain/entities/ResourceList";
import { IDataSource } from "@/shared/core/interfaces/data/IDataSource";
import { GENERATION_URL } from "@/shared/core/constant/const";

/**
 * Repository per gestire la lista delle risorse delle generazioni Pokémon.
 */
export class ResourceListRepository implements IResourceListRepository {
    private readonly BASE_URL = GENERATION_URL;
    protected readonly className = "ResourceListRepository";
    constructor(
        protected readonly dataSource: IDataSource<PokeApiResponse<NamedResource>>,
        protected readonly mapper: IMapper<PokeApiResponse<NamedResource>, ResourceList>
    ) { }
    /**
     * Recupera la lista delle risorse delle generazioni Pokémon.
     * @returns Una promessa che risolve l'entità ResourceList corrispondente 
     */
    async get(): Promise<ResourceList> {
        try {
        const data = await this.dataSource.fetchData(this.BASE_URL);
        return this.mapper.toDomain(data);
        } catch (error) {
            throw error;
        }
    }
}