import { defineStore } from "pinia";
import { IGetGenerationUseCase } from "../../domain/usecases/IGetGenerationUseCase";
import { Generation } from "../../domain/entities/Generation";
import { CacheMap } from "@/infrastructure/cache/types/CacheItem";
import { fetchWithMemoryCache } from "@/infrastructure/cache/helpers/CacheHelper";

/**
 * Store Pinia per gestire lo stato della generazione dei Pokémon.
 */
export const useGenerationStore = defineStore('generation', {
    state: () => ({
        cache: {} as CacheMap<Generation[]>,
        generationData: null as Generation[] | null,
        loading: false,
        error: null as Error | null,
    }),
    actions: {
        /**
         * Recupera i dati della generazione dei Pokémon utilizzando il caso d'uso fornito.
         * @param getGenerationUseCase - Il caso d'uso per ottenere i dati della generazione dei Pokémon
         * @returns Una promessa che risolve quando i dati sono stati recuperati
         * @throws Error se il recupero dei dati fallisce
         */
        async ensureLoaded(
            getGenerationUseCase: IGetGenerationUseCase,
        ): Promise<void> {
            try {
                const key = `generation:all`;
                const response = await fetchWithMemoryCache<Generation[]>(
                    key,
                    this.cache,
                    () => getGenerationUseCase.execute()
                );

                if(response.success)
                    this.generationData = response.data ?? null;
                else
                    this.error = response.error;
            } catch (error) {
                this.error = error as Error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Imposta lo stato iniziale dello store.
         */
        setInit() {
            this.error = null;
            this.generationData = null;
            this.loading = true;
        }
    }
});