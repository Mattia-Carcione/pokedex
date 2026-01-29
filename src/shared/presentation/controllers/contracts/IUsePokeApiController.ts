import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { ComputedRef } from "vue";

/**
 * Contratto per il controller che gestisce le operazioni relative alla PokeApi.
 */
export abstract class IUsePokeApiController extends IUseControllerBase {
    /** Getter per i risultati della ricerca */
    abstract get isLoading(): ComputedRef<boolean>;

    /** Getter per l'eventuale errore */
    abstract get error(): ComputedRef<Error | null>;

    /** Getter per i risultati della ricerca */
    abstract get data(): ComputedRef<Pokemon[] | null>;
}
