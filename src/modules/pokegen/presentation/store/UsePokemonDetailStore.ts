import { defineStore } from "pinia";
import { IGetPokemonDetail } from "../../domain/usecases/IGetPokemonDetail";
import { PokemonDetail } from "../../domain/entities/PokemonDetail";

/**
 * Store Pinia per gestire lo stato del dettaglio del Pokémon.
 */
export const usePokemonDetailStore = defineStore('pokemonDetail', {
    state: () => ({
        pokemonDetailData: null as PokemonDetail | null,
        loading: false,
        error: null as Error | null,
    }),
    actions: {
        /**
         * Recupera i dati del dettaglio del Pokémon utilizzando il caso d'uso fornito.
         * @param getPokemonDetailUseCase - Il caso d'uso per ottenere i dati del dettaglio del Pokémon
         * @returns Una promessa che risolve quando i dati sono stati recuperati
         * @throws Error se il recupero dei dati fallisce
         */
        async ensureLoaded(
            getPokemonDetailUseCase: IGetPokemonDetail,
            key: string
        ): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await getPokemonDetailUseCase.execute(key);
                if(response.success && response.data)
                    this.pokemonDetailData = response.data || null;
                else if(response.success && !response.data) {
                    this.pokemonDetailData = null;
                    this.error = new Error("Dettaglio del Pokémon non trovato.");
                }
                else {
                    this.error = response.error;
                    this.pokemonDetailData = null;
                }
            } catch (error) {
                this.error = error as Error;
            } finally {
                this.loading = false;
            }
        }
    }
});