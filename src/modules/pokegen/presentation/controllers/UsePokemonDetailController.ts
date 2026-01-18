import { computed } from "vue";
import { IUseControllerBase } from "./IUseControllerBase";
import { PokemonDetailStore } from "../store/types/StoreTypes";
import { IGetPokemonDetail } from "../../domain/usecases/IGetPokemonDetail";

/**
 * Implementazione del controller della generazione dei Pokémon.
 */
export class UsePokemonDetailController extends IUseControllerBase {
    constructor(
        private store: PokemonDetailStore,
        private useCase: IGetPokemonDetail, 
    ) { super(); }

    /**
     * Recupera i dati della generazione dei Pokémon dallo store.
     */
    get data() {
        return computed(() => {
            const data = this.store.pokemonDetailData;
            if(!data)
                return [];
            return [data];
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
    async loadData(input: string): Promise<void> {
        await this.store.ensureLoaded(this.useCase, input);
    }
}