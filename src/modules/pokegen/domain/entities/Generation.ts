// import { NamedResource } from "@/shared/core/types/CommonTypes";
import { AppRouteName } from "@/shared/core/enums/AppRouteName";
import { NamedResource } from "@/shared/core/types/CommonTypes";
import { convertToRomanNumber } from "@/shared/core/utils/helpers/ConvertToRomanNumber";

/**
 * Rappresenta una generazione di Pokémon.
 * @property id (number) - l'id della generazione
 * @property name (string) - il nome della generazione
 * @property pokemonList (NamedResource[]) - la lista delle specie di Pokémon appartenenti a questa generazione
 */
export class Generation {
    constructor(
        public readonly version: number,
        public readonly name: string,
        public readonly pokemon: NamedResource[] = []
    ) {}
    
    /**
     * Etichetta per il link di navigazione.
     */
    public get label(): string { 
        return `Vai alla Generazione: ${this.version}`; 
    }

    /**
     * Restituisce l'uri alla route della generazione.
     */
    public get href(): { name: string; params: { id: number } } {
        return { name: AppRouteName.Generation, params: { id: Number(this.version) } };
    }

    /**
     * Converte il numero della generazione in numero romano per la visualizzazione.
     */
    public get displayVersion(): string {
        return convertToRomanNumber(this.version);
    }
}