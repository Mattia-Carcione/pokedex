import { defineStore } from "pinia";
import { IGetGenerationUseCase } from "../../domain/usecases/IGetGenerationUseCase";
import { Generation } from "../../domain/entities/Generation";

/**
 * Store Pinia per gestire lo stato della generazione dei Pokémon.
 */
export const useGenerationStore = defineStore('generation', {
    state: () => ({
        generationData: null as Generation[] | null,
        loading: false,
        error: null as Error | null,
    }),
    actions: {
        /**
         * Recupera i dati della generazione dei Pokémon utilizzando il caso d'uso fornito.
         * @param GetGenerationUseCase - Il caso d'uso per ottenere i dati della generazione dei Pokémon
         * @returns Una promessa che risolve quando i dati sono stati recuperati
         * @throws Error se il recupero dei dati fallisce
         */
        async ensureLoaded(
            GetGenerationUseCase: IGetGenerationUseCase,
        ): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await GetGenerationUseCase.execute();
                const data = response.data;
                if(response.success && data)
                    this.generationData = data || null;
                else if(response.success && !data) {
                    this.generationData = null;
                    this.error = new Error("Generation data not found.");
                }
                else {
                    this.error = response.error;
                    this.generationData = null;
                }
            } catch (error) {
                this.error = error as Error;
            } finally {
                this.loading = false;
            }
        }
    }
});