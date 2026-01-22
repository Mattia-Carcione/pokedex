import { IRepository } from "@/core/contracts/data/IRepository";
import { Generation } from "../entities/Generation";

/**
 * Interfaccia per il repository di generazione dei Pokémon.
 */
export interface IGenerationRepository extends IRepository<Generation> { }