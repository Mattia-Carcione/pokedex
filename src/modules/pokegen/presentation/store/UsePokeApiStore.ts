import { defineStore } from "pinia";
import { NamedResource } from "@/core/types/CommonTypes";
import { IGetPokeApiUseCase } from "@/shared/domain/usecases/IGetPokeApiUseCase";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";
import { IGetSearchPokemonUseCase } from "@/modules/pokegen/domain/usecases/IGetSearchPokemonUseCase";

/**
 * Store Pinia per gestire lo stato dell'indice dei Pokémon.
 */
export const usePokeApiStore = defineStore("pokemonIndex", {
  state: () => ({
    data: null as Pokemon[] | null,
    list: null as NamedResource[] | null,
    loading: false,
    error: null as Error | null,
  }),

  actions: {
    /**
     * Fetch iniziale della lista completa dei Pokémon.
     */
    async load(useCase: IGetPokeApiUseCase): Promise<void> {
      const result = await useCase.execute();
      if (result.success) this.list = result.data ?? [];
      else {
        this.error = result.error ?? new Error("Errore sconosciuto");
        this.list = null;
      }

      this.loading = false;
    },

    /**
     * Ricerca locale (startsWith)
     */
    async search(prefix: string, useCase: IGetSearchPokemonUseCase): Promise<void> {
      if (!this.list) return;

      this.data = [];
      const data: Pokemon[] = [];
      const value = prefix.trim().toLowerCase();

      const pokemon = this.list.filter((p) => p.name.startsWith(value));

      const task = pokemon.map(async (p) => {
        const response = await useCase.execute(p.url);
        return response;
      });

      const result = (await Promise.all(task)).flat();

      const seen = new Set<string>();

      result.forEach((r) => {
        if (r.success) {
          if (r.data && !seen.has(r.data.name)) {
            seen.add(r.data.name);
            data.push(r.data);
          }
        } else {
          this.error = r.error ?? new Error("Error unknown");
        }
      });
      this.data = data;
      this.loading = false;
    },

    /**
     * Imposta lo stato iniziale dello store.
     */
    init(): void {
      this.data = [];
      this.list = null;
      this.loading = false;
      this.error = null;
    },

    /** Imposta lo stato di caricamento */
    initLoading() {
      this.loading = true;
      this.error = null;
    }
  },
});
