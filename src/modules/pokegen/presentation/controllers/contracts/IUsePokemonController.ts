import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { ComputedRef } from "vue";
import { DetailViewModel } from "../../viewmodels/DetailViewModel";
import { HomeViewModel } from "../../viewmodels/HomeViewModel";
import { TypeRequestEnum } from "../../enums/TypeRequestEnum";

/**
 * Contratto per il controller che gestisce le operazioni relative alla PokeApi.
 */
export abstract class IUsePokemonController extends IUseControllerBase {
    /** Getter per i risultati della ricerca */
    abstract get isLoading(): ComputedRef<boolean>;

    /** Getter per l'eventuale errore */
    abstract get error(): ComputedRef<Error | null>

    /** Getter per i risultati della ricerca */
    abstract get data(): ComputedRef<[] | HomeViewModel | DetailViewModel>;

    /**
     * Esegue una ricerca locale tra i Pokémon per nome.
     * @param prefix Il prefisso da cercare.
     * @returns Una lista di risorse nominate che corrispondono al prefisso.
     */
    abstract searching(input: { endpoint: string, req: TypeRequestEnum }): Promise<void>;
}
