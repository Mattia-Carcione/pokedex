import { TYPE_COLORS } from "@/app/const";
import { TYPE_ICONS } from "@/app/const";
import { AppRouteName } from "@/shared/core/enums/AppRouteName";

/**
 * Rappresenta un Pokémon nel dominio dell'applicazione.
 * @property id (number) - l'id del pokémon
 * @property name (string) - il nome del pokémon
 * @property types (string[]) - i tipi del pokémon
 * @property sprite (string) - il percorso dell'immagine del pokémon
 */
export class Pokemon {
    constructor (
        public readonly id: number,
        public readonly name: string,
        public readonly types: string[],
        public readonly sprite: string,
    ) {};
    
    /**
     * Restituisce il nome del Pokémon con la prima lettera maiuscola.
     */
    get displayName() : string {
        return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }

    /**
     * Indica se il Pokémon ha due tipi.
     */
    get isDoubleType() : boolean {
        return this.types.length > 1;
    }

    /**
     * Restituisce un array di oggetti contenenti il tipo, il colore associato e l'icona del tipo.
     */
    get typesInfo(): { name: string; color: string; icon: string }[] {
        return this.types.map(type => ({
            name: type,
            color: TYPE_COLORS[type],
            icon: TYPE_ICONS[type]
        }));
    }

    /**
     * Restituisce il numero del Pokédex formattato con zeri iniziali.
     */
    public get pokedexNumber(): string {
        return this.id.toString().padStart(3, '0');
    }

    /**
     * Restituisce l'uri alla route del dettaglio del Pokémon.
     */
    public get href(): { name: string; params: { name: string; id: number } } {
        return { name: AppRouteName.Pokemon, params: { name: this.name, id: this.id } };
    }
}