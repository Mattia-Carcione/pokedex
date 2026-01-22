import { defineStore } from "pinia";
import { IGetPokemonUseCase } from "../../domain/usecases/IGetPokemonUseCase";
import { Pokemon } from "../../domain/entities/Pokemon";
import { IGetPokemonDetailUseCase } from "../../domain/usecases/IGetPokemonDetailUseCase";
import { TypeRequestEnum } from "../enums/TypeRequestEnum";

/**
 * Store Pinia per gestire lo stato della generazione dei Pokémon.
 */
export const usePokegenStore = defineStore('pokegen', {
    state: () => ({
        pokemon: null as Pokemon[] | null,
        loading: false,
        error: null as Error | null,
        typeRequest: null as TypeRequestEnum | null
    }),
    actions: {
        /**
         * Recupera i dati della generazione dei Pokémon utilizzando il caso d'uso fornito.
         * @param GetPokemonUseCase - Il caso d'uso per ottenere i dati della generazione dei Pokémon
         * @returns Una promessa che risolve quando i dati sono stati recuperati
         * @throws Error se il recupero dei dati fallisce
         */
        async ensureLoaded(
            GetPokemonUseCase: IGetPokemonUseCase | IGetPokemonDetailUseCase,
            input: { endpoint: string, req: TypeRequestEnum }
        ): Promise<void> {
            this.loading = true;
            this.error = null;
            try {
                const response = await GetPokemonUseCase.execute(input.endpoint);
                if(response.success && response.data)
                    this.pokemon = response.data || null;
                else if(response.success && !response.data) {
                    this.pokemon = null;
                    this.error = new Error("Pokemon data not found.");
                }
                else {
                    this.error = response.error;
                    this.pokemon = null;
                }
                this.typeRequest = input.req;
            } catch (error) {
                this.error = error as Error;
            } finally {
                this.loading = false;
            }
        }
    }
});