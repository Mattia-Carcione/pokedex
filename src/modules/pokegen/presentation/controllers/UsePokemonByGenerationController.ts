import { computed } from "vue";
import { IUseControllerBase } from "./IUseControllerBase";
import { PokegenStore } from "../store/types/StoreTypes";
import { IGetPokemonByGeneration } from "../../domain/usecases/IGetPokemonByGeneration";
import { HomeViewModel } from "../viewmodels/HomeViewModel";

/**
 * Implementazione del controller della generazione dei Pokémon.
 */
export class UsePokemonByGenerationController extends IUseControllerBase {
    constructor(
        private store: PokegenStore,
        private useCase: IGetPokemonByGeneration, 
    ) { super(); }

    /**
     * Recupera i dati della generazione dei Pokémon dallo store.
     */
    get data() {
        return computed(() => {
            const data = this.store.generationData;
            if(!data)
                return [];
            return new HomeViewModel(data.generationId, data.generationName, data.pokemon.sort((a, b) => a.id - b.id));
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
        const key = Number(input);
        await this.store.ensureLoaded(this.useCase, key);
    }
}