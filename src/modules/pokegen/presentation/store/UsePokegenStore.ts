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
        typeRequest: null as TypeRequestEnum | null,
        input: '' as string,
    }),
    actions: {
        /**
         * Recupera i dati della generazione dei Pokémon utilizzando il caso d'uso fornito.
         * @param getPokemonUseCase - Il caso d'uso per ottenere i dati della generazione dei Pokémon
         * @returns Una promessa che risolve quando i dati sono stati recuperati
         * @throws Error se il recupero dei dati fallisce
         */
        async ensureLoaded(
            getPokemonUseCase: IGetPokemonUseCase | IGetPokemonDetailUseCase,
            input: { endpoint: string, req: TypeRequestEnum }
        ): Promise<void> {
            const response = await getPokemonUseCase.execute(input.endpoint)

            if (response.success)
                this.pokemon = response.data ?? null;
            else 
                this.error = response.error ?? new Error("Error unknown");

            this.loading = false;
        },

        /**
         * Imposta lo stato iniziale dello store.
         */
        setInit(input: { endpoint: string, req: TypeRequestEnum }): void {
            this.pokemon = null;
            this.error = null;
            this.typeRequest = input.req;
            this.input = input.endpoint;
            this.loading = true;
        }
    }
});