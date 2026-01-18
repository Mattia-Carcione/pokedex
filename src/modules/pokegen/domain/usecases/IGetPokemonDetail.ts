import { Result } from "@/shared/core/interfaces/domain/entities/Result";
import { PokemonDetail } from "../entities/PokemonDetail";

/**
 * Interfaccia per il caso d'uso di recupero del Pokémon per id.
 */
export interface IGetPokemonDetail {
    /**
     * Recupera il dettaglio completo di un Pokémon dato il suo id.
     * @returns Una promessa che risolve il dettaglio del Pokémon richiesto.
    */
    execute(id: string): Promise<Result<PokemonDetail, Error>>
}