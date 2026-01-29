import { NavbarViewModel } from "@/app/presentation/viewmodels/NavbarViewModel";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { ComputedRef } from "vue";

/**
 * Contratto per il controller che gestisce le operazioni relative alla PokeApi.
 */
export abstract class IUseGenerationController extends IUseControllerBase {
    /** Getter per i risultati della ricerca */
    abstract get isLoading(): ComputedRef<boolean>;

    /** Getter per l'eventuale errore */
    abstract get error(): ComputedRef<Error | null>

    /** Getter per i risultati della ricerca */
    abstract get data(): ComputedRef<NavbarViewModel | never[]>;
}
