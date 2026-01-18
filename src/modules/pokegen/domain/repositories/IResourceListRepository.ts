import { ResourceList } from "@/modules/pokegen/domain/entities/ResourceList";

/**
 * Repository per gestire la lista delle risorse delle generazioni Pokémon.
 */
export interface IResourceListRepository {
    /**
     * Recupera i dati di tutte le generazioni disponibili.
     * @returns Una promessa che risolve una lista di risorse rappresentanti le generazioni
    */
    get(): Promise<ResourceList>;
}