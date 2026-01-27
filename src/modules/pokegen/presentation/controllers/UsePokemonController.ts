import { computed, ComputedRef, shallowRef, watch } from "vue";
import { PokegenStore } from "../store/types/StoreTypes";
import { IGetPokemonUseCase } from "../../domain/usecases/IGetPokemonUseCase";
import { IGetPokemonDetailUseCase } from "../../domain/usecases/IGetPokemonDetailUseCase";
import { IUseControllerBase } from "@/core/contracts/presentation/IUseControllerBase";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IPokemonViewMapper } from "../mappers/contracts/IPokemonViewMapper";
import { HomeViewModel } from "../viewmodels/HomeViewModel";
import { DetailViewModel } from "../viewmodels/DetailViewModel";
import { TypeRequestEnum } from "../enums/TypeRequestEnum";
import { Pokemon } from "../../domain/entities/Pokemon";

/**
 * Implementazione del controller della generazione dei Pokémon.
 */
export class UsePokemonController extends IUseControllerBase {
    private homeVM = shallowRef<HomeViewModel | null>(null);
    private detailVM = shallowRef<DetailViewModel | null>(null);

    /**
     * Costruttore del controller.
     * @param store Lo store della generazione dei Pokémon.
     * @param useCase Il caso d'uso per ottenere i dati della generazione dei Pokémon.
     * @param detailUseCase Il caso d'uso per ottenere i dettagli di un Pokémon specifico.
     * @param mapper Il mapper per convertire i dati del Pokémon in ViewModel.
     * @param logger Il logger per la registrazione delle operazioni.
     */
    constructor(
        private readonly store: PokegenStore,
        private readonly useCase: IGetPokemonUseCase,
        private readonly detailUseCase: IGetPokemonDetailUseCase,
        private readonly mapper: IPokemonViewMapper,
        private readonly logger: ILogger
    ) {
        super();

        watch(() => [this.store.pokemon, this.store.typeRequest], ([data, req]) => {
            if (!data || !req) return;
            switch (req) {
                case TypeRequestEnum.HOME:
                    const homeResponse = data as Pokemon[];
                    this.buildHomeViewModel(homeResponse);
                    break;
                case TypeRequestEnum.DETAIL:
                    const detailResponse = data as Pokemon[];
                    this.buildDetailViewModel(detailResponse);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Recupera i dati della generazione dei Pokémon dallo store.
     */
    get data(): ComputedRef<[] | HomeViewModel | DetailViewModel> {
        return computed(() => {
            switch (this.store.typeRequest) {
                case TypeRequestEnum.HOME:
                    return this.homeVM.value ?? [];
                case TypeRequestEnum.DETAIL:
                    return this.detailVM.value ?? [];
                default:
                    return [];
            }
        });
    }

    /**
     * Indica se i dati della generazione sono in fase di caricamento.
     */
    get isLoading(): ComputedRef<boolean> {
        return computed(() => {
            return this.store.loading;
        });
    }

    /**
     * Recupera l'errore dallo store, se presente.
     */
    get error(): ComputedRef<Error | null> {
        return computed(() => this.store.error);
    }

    /**
     * Gestisce la richiesta di generazione dei Pokémon.
     * @param input Input contenente l'endpoint e il tipo di richiesta.
     * @returns Una Promise che si risolve quando i dati sono stati caricati.
     */
    async loadData(input: { endpoint: string, req: TypeRequestEnum }): Promise<void> {
        this.store.setInit(input);
        if (input.req === TypeRequestEnum.DETAIL)
            await this.store.ensureLoaded(this.detailUseCase, input);
        else
            await this.store.ensureLoaded(this.useCase, input);

        this.logger.info("[UsePokemonController] - Dati dei Pokémon caricati con successo.");
    }
    
    /** 
     * Costruisce il ViewModel per la vista principale. 
     * @param data I dati dei Pokémon da mappare.
    */
    private buildHomeViewModel(data: Pokemon[]): void {
        this.homeVM.value = new HomeViewModel(data.map(p => this.mapper.map(p)));
    }

    /** 
     * Costruisce il ViewModel per la vista dei dettagli. 
     * @param data I dati dei Pokémon da mappare.
    */
    private buildDetailViewModel(data: Pokemon[]): void {
        const name = this.store.input?.toLowerCase() || '';
        const main = data.find(p => p.nameSpecies.toLowerCase() === name);

        if (!main) return;
        const index = data.indexOf(main);
        const prev = data[index - 1] ?? null;
        const next = data[index + 1] ?? null;

        this.detailVM.value = new DetailViewModel(
            this.mapper.mapDetail(main),
            prev ? this.mapper.map(prev) : null,
            next ? this.mapper.map(next) : null
        );
    }
}
