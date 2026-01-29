import { computed, ComputedRef } from "vue";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { IGetPokeApiUseCase } from "@/shared/domain/usecases/IGetPokeApiUseCase";
import { PokeApiStore } from "../stores/types/SharedStoreTypes";
import { IUsePokeApiController } from "./contracts/IUsePokeApiController";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * Controller per la ricerca dei Pokémon tramite PokeApi.
 */
export class UsePokeApiController implements IUsePokeApiController {
  constructor(
    private readonly store: PokeApiStore,
    private readonly getIndexUseCase: IGetPokeApiUseCase,
    private readonly logger: ILogger,
  ) {}

  /** Inizializza lo store caricando l'indice dei Pokémon se non già presente */
  async loadData(): Promise<void> {
    if (this.store.list) return;
    this.store.init();
    this.logger.info("[UsePokeApiController] - Init pokemon index");
    await this.store.load(this.getIndexUseCase);
  }

  /** Getter per i risultati della ricerca */
  get data(): ComputedRef<Pokemon[] | null> {
    return computed(() => this.store.data);
  }

  /** Getter per lo stato di caricamento */
  get isLoading(): ComputedRef<boolean> {
    return computed(() => this.store.loading);
  }

  /** Getter per l'eventuale errore */
  get error(): ComputedRef<Error | null> {
    return computed(() => this.store.error);
  }
}
