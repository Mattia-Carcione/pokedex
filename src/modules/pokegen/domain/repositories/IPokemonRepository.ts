import { IRepository } from "@/core/contracts/data/IRepository";
import { Pokemon } from "../entities/Pokemon";

/**
 * Interfaccia per il repository dei Pokémon.
 */
export interface IPokemonRepository extends IRepository<Pokemon> {
    getDetailAsync(name: string): Promise<Pokemon>;
 }