import { Generation } from "@/modules/pokegen/domain/entities/Generation";

/**
 * ViewModel per la barra di navigazione dell'applicazione.
 * 
 * @param version - La versione della generazione Pokémon.
 * @param name - Il nome della generazione Pokémon.
 */
export class NavbarViewModel {
    constructor(
        public readonly generation: Generation[]
    ) {}

}