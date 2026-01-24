import { computed, ComputedRef } from "vue";
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
    constructor(
        private readonly store: PokegenStore,
        private readonly useCase: IGetPokemonUseCase,
        private readonly detailUseCase: IGetPokemonDetailUseCase,
        private readonly mapper: IPokemonViewMapper,
        private readonly logger: ILogger
    ) { super(); }

    /**
     * Recupera i dati della generazione dei Pokémon dallo store.
     */
    get data(): ComputedRef<never[] | HomeViewModel | DetailViewModel> {
        return computed(() => {
            const data = this.store.pokemon;
            this.logger.debug("[UsePokemonController] - Dati del Pokémon: ", data);
            if(!data || !this.store.typeRequest)
                return [];
            return this.mapData(this.store.typeRequest, data);
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
        this.logger.debug("[UsePokemonController] - Errore durante il recupero dei dati del Pokémon", this.store.error);
        return computed(() => this.store.error);
    }

    /**
     * Gestisce la richiesta di generazione dei Pokémon.
     * @param input Input contenente l'endpoint e il tipo di richiesta.
     * @returns Una Promise che si risolve quando i dati sono stati caricati.
     */
    async loadData(input: { endpoint: string, req: TypeRequestEnum }): Promise<void> {
        this.logger.debug("[UsePokemonController] - Caricamento dei dati del Pokémon per: ", input);
        if(input.req === TypeRequestEnum.DETAIL)
            await this.store.ensureLoaded(this.detailUseCase, input);
        else
            await this.store.ensureLoaded(this.useCase, input);
    }

    /**
     * Mappa i dati recuperati in base al tipo di richiesta.
     * @param req Tipo di richiesta (HOME o DETAIL).
     * @param data Dati dei Pokémon da mappare.
     * @returns I dati mappati come HomeViewModel, DetailViewModel o un array vuoto.
     */
    private mapData(req: TypeRequestEnum, data: Pokemon[]): HomeViewModel | never[] | DetailViewModel {
        switch(req) {
            case TypeRequestEnum.HOME:
                return new HomeViewModel(data.map(pokemon => this.mapper.map(pokemon)));
            case TypeRequestEnum.DETAIL:
                return new DetailViewModel(data.map(pokemon => this.mapper.mapDetail(pokemon))[0], data.map(pokemon => this.mapper.mapDetail(pokemon))[0], data.map(pokemon => this.mapper.mapDetail(pokemon))[0]);
            default:
                return [];
        }
    }
}