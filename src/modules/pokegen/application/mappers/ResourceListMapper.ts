import { ResourceList } from "@/modules/pokegen/domain/entities/ResourceList";
import { MappingError } from "@/shared/core/errors/MappingError";
import { IMapper } from "@/shared/core/interfaces/application/mappers/IMapper";
import { PokeApiResponse } from "@/shared/core/types/ApiTypes";
import { NamedResource } from "@/shared/core/types/CommonTypes";

/**
 * Mapper per convertire la risposta paginata della PokeAPI in un'entità di dominio ResourceList.
 */
export class ResourceListMapper implements IMapper<PokeApiResponse<NamedResource>, ResourceList> {
    /**
     * Converte un singolo DTO PokeApiResponse in ResourceList.
     * Questo metodo è un alias di toDomainList per conformità con IMapper.
     * @throws {MappingError} Se i dati ricevuti sono incompleti.
     */
    toDomain(data: PokeApiResponse<NamedResource>): ResourceList {
        if (data.count === undefined || !Array.isArray(data.results))
            throw new MappingError("Risposta API incompleta: count o results mancanti", data);

        try {
            const count: number = data.count;
            const results: NamedResource[] = data.results.map((item: any) => ({
                name: item.name,
                url: item.url
            }));
            return new ResourceList(count, results);
        } catch(error) {
            throw new MappingError("Errore durante la mappatura della ResourceList", data, error as Error);
        }
    }
}