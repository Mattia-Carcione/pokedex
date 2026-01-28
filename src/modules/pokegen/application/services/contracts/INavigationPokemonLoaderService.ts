import { IService } from "@/core/contracts/services/IServices";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * Contratto per il servizio di caricamento dei Pokémon per la navigazione.
 */
export interface INavigationPokemonLoaderService extends IService<Pokemon[]> { }
