import { TYPE_COLORS, TYPE_ICONS } from "@/const";
import { CardPokemon } from "@/types/components/cardPokemon";
import { DetailPkm } from "@/types/components/detailPkm";
import { NavGen } from "@/types/components/navGen";
import { TypePkm } from "@/types/components/typePkm";
import { Generation } from "@/types/pokemon/generation";
import { Pokemon } from "@/types/pokemon/pokemon";
import { PokemonSpecies } from "@/types/pokemon/pokemonSpecies";
import { Type } from "@/types/pokemon/type";
import { Routing } from "@/types/routing";

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
                href: { name: 'generation', params: { id: e.id } },
                label: `Vai alla Gen ${e.id}`
            }
        })
    }

    /**
     * Funzione che mappa i dati dei Pokémon per la card
     * @param param0 ({ name, id, types, sprites }) Le info del Pokémon da mappare
     * @param maxNumber (number) Il numero massimo di Pokémon
     */
    static CardPokemonMapper({ species, id, types, sprites }: Pokemon, maxNumber: number): CardPokemon {
        const name = species.name;
        return {
            id: this.SetPokedexNumber(Number(id), maxNumber),
            name: name,
            href: { name: 'pokemon', params: { name }, query: { id: id } },
            displayName: name.charAt(0).toUpperCase() + name.slice(1),
            types: this.SetTypes(types),
            src: sprites.other.home.front_default ?? sprites.front_default,
        }
    }

    /**
     * Funzione che mappa i dati dei Pokémon per la card
     * @param param0 ({ name, id, types, sprites }) Le info del Pokémon da mappare
     * @param maxNumber (number) Il numero massimo di Pokémon
     */
    static DetailPokemonMapper(cardPkm: CardPokemon, pkm: PokemonSpecies, prev: Pokemon | null, next: Pokemon | null, count: number): DetailPkm {
        try {
            let femaleRate;
            let maleRate;
            let genderRate = null;
            if(pkm.gender_rate > 0) {
                femaleRate = (pkm.gender_rate / 8) * 100;
                maleRate = 100 - femaleRate;
                genderRate = { male: maleRate, female: femaleRate }
            }
            let nextPkm = null;
            let prevPkm = null;
            if (prev) prevPkm = this.MapNextOrPrev(prev, count);
            if (next) nextPkm = this.MapNextOrPrev(next, count);
            return {
                ...cardPkm,
                genderRate: genderRate,
                next: nextPkm,
                prev: prevPkm,
                generation: this.SetGenerationName(pkm.generation.name)
            }
        } catch (err) {
            console.log(err);
        }
    }

    private static MapNextOrPrev({ species, id, sprites }: Pokemon, maxNumber: number): { id: string | number; name: string; src: string; href: Routing; } {
        const name = species.name;
        try {
            return {
                id: this.SetPokedexNumber(Number(id), maxNumber),
                name: name,
                src: sprites.other.home.front_default ?? sprites.front_default,
                href: { name: 'pokemon', params: { name }, query: { id: id } }
            }
        } catch (err) {
            console.log(err);
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
                src: TYPE_ICONS[type.name.toLowerCase()] ?? '',
                color: TYPE_COLORS[type.name.toLowerCase()] ?? '',
            }
        })
    }
}

