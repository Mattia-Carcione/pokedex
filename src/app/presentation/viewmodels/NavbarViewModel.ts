import { GenerationVM } from "@/shared/viewmodels/GenerationVM";

/**
 * ViewModel per la barra di navigazione dell'applicazione.
 * 
 * @param version - La versione della generazione Pokémon.
 * @param name - Il nome della generazione Pokémon.
 */
export class NavbarViewModel {
    constructor(
        public readonly generation: GenerationVM[]
    ) {}
}