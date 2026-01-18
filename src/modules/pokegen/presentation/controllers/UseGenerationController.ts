import { computed } from "vue";
import { IUseControllerBase } from "./IUseControllerBase";
import { GenerationStore } from "../store/types/StoreTypes";
import { IGetGeneration } from "../../domain/usecases/IGetGeneration";
import { NavbarViewModel } from "@/app/presentation/viewmodels/NavbarViewModel";

/**
 * Implementazione del controller della generazione dei Pokémon.
 */
export class UseGenerationController extends IUseControllerBase {
    constructor(
        private store: GenerationStore,
        private useCase: IGetGeneration, 
    ) { super(); }

    /**
     * Recupera i dati della generazione dei Pokémon dallo store.
     */
    get data() {
        return computed(() => {
            const data = this.store.generationData;
            if(!data)
                return [];
            return new NavbarViewModel(data);
        });
    }

    /**
     * Indica se i dati della generazione sono in fase di caricamento.
     */
    get isLoading() {
        return computed(() => {
            return this.store.loading;
        });
    }

    /**
     * Recupera l'errore dallo store, se presente.
     */
    get error() {
        return computed(() => this.store.error);
    }

    /**
     * Gestisce la richiesta di generazione dei Pokémon.
     */
    async loadData(): Promise<void> {
        await this.store.ensureLoaded(this.useCase);
    }
}