import { TYPE_COLORS, TYPE_ICONS } from "@/const";
import { CardPokemon } from "@/types/components/cardPokemon";
import { NavGen } from "@/types/components/navGen";
import { TypePkm } from "@/types/components/typePkm";
import { Generation } from "@/types/pokemon/generation";
import { Pokemon } from "@/types/pokemon/pokemon";
import { Type } from "@/types/pokemon/type";

/**
 * Classe static Mapper per mapppare i dati dei Pokémon ricevuti dall'Api
 * @constructor private constructor()
 * @function NavbarMapper (data: Generation[]) - Funzione che mappa una lista di generazioni per la navbar
 * @function CardPokemonMapper ({ name, id, types, sprites }: Pokemon, maxNumber: number) - Funzione che mappa i dati dei Pokémon per la card
 */
export class Mapper {
    private constructor() { }

    /**
     * Funzione che mappa una lista di generazioni per la navbar
     * @param data (Generation[]) Lista delle generazioni
     */
    static NavbarMapper(data: Generation[]): NavGen[] {
        return data.map((e) => {
            const name = this.SetGenerationName(e.name);
            return {
                id: e.id,
                name: name,
                href: `/generation/${e.id}`,
                label: `Vai alla Gen ${e.id}`
            }
        })
    }

    /**
     * Funzione che mappa i dati dei Pokémon per la card
     * @param param0 ({ name, id, types, sprites }) Le info del Pokémon da mappare
     * @param maxNumber (number) Il numero massimo di Pokémon
     */
    static CardPokemonMapper({ name, id, types, sprites }: Pokemon, maxNumber: number): CardPokemon {
        return {
            id: this.SetPokedexNumber(Number(id), maxNumber),
            name: name,
            displayName: name.charAt(0).toUpperCase() + name.slice(1),
            types: this.SetTypes(types),
            src: sprites.other.home.front_default ?? sprites.front_default,
        }
    }

    /**
     * Funzione che imposta il nome della generazione
     * @param input (string) Nome della generazioni da settare
     */
    private static SetGenerationName(input: string): string {
        return input.split('-')[input.split("-").length - 1].toUpperCase();
    }

    /**
     * Funzione che imposta il numero Pokédex
     * @param key è l'identificativo del Pokémon
     * @param maxNumber Numero totale di Pokémon
     */
    private static SetPokedexNumber(key: number, maxNumber: number): string {
        const length = maxNumber.toString().length;
        return key.toString().padStart(length, '0');
    }

    /**
     * Funzione che mappa i tipi per la card Pokémon
     * @param types (Type[]) L'insieme dei tipi Pokémon
     */
    private static SetTypes(types: Type[]): TypePkm[] {
        return types.map(({ type }, x) => {
            return {
                id: (x + 1),
                name: type.name,
                src: TYPE_ICONS[type.name] ?? '',
                color: TYPE_COLORS[type.name] ?? '',
            }
        })
    }
}

