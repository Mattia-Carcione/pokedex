import { computed } from "vue";
import { IUseControllerBase } from "../../../../core/contracts/presentation/IUseControllerBase";
import { GenerationStore } from "../store/types/StoreTypes";
import { IGetGenerationUseCase } from "../../domain/usecases/IGetGenerationUseCase";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { INavbarMapper } from "../mappers/contracts/INavbarMapper";

/**
 * Implementazione del controller della generazione dei Pokémon.
 */
export class UseGenerationController extends IUseControllerBase {
    constructor(
        private readonly store: GenerationStore,
        private readonly useCase: IGetGenerationUseCase,
        private readonly mapper: INavbarMapper,
        private readonly logger: ILogger
    ) { super(); }

    /**
     * Recupera i dati della generazione dei Pokémon dallo store.
     */
    get data() {
        return computed(() => {
            const data = this.store.generationData;
            this.logger.debug("[UseGenerationController] - Dati della generazione: ", data);
            if(!data)
                return [];
            return this.mapper.map(data);
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
        this.logger.debug("[UseGenerationController] - Errore durante il recupero dei dati della generazione", this.store.error);
        return computed(() => this.store.error);
    }

    /**
     * Gestisce la richiesta di generazione dei Pokémon.
     */
    async loadData(): Promise<void> {
        await this.store.ensureLoaded(this.useCase);
    }
}