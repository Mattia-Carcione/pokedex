import { TYPE_COLORS, TYPE_ICONS } from "@/const";
import { CardPokemon } from "@/types/components/cardPokemon";
import { DetailPkm, VersionDetail } from "@/types/components/detailPkm";
import { NavGen } from "@/types/components/navGen";
import { TypePkm } from "@/types/components/typePkm";
import { NamedApi, Names } from "@/types/pokeApi";
import { Generation } from "@/types/pokemon/generation";
import { Pokemon } from "@/types/pokemon/pokemon";
import { PokemonSpecies } from "@/types/pokemon/pokemonSpecies";
import { Type } from "@/types/pokemon/type";
import { Routing } from "@/types/routing";
import { RomanToArabic } from "./romanToArabicNumber";
import { Version, VersionGroup } from "@/types/pokemon/versionGroup";

/**
 * Classe static Mapper per mapppare i dati dei Pokémon ricevuti dall'Api
 * @constructor private constructor()
 * @function NavbarMapper (data: Generation[]) - Funzione che mappa una lista di generazioni per la navbar
 * @function CardPokemonMapper ({ name, id, types, sprites }: Pokemon, maxNumber: number) - Funzione che mappa le informazioni principali dei Pokémon per la card
 * @function DetailPokemonMapper (pkm: Pokemon, pkmSpecies: PokemonSpecies, prev: Pokemon | null, next: Pokemon | null, count: number): DetailPkm - Funzione che mappa tutti i dati dei Pokémon per il dettaglio della card
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
     * Mappa un VersionGroup in un oggetto semplificato.
     * 
     * - Estrae i nomi di tutte le versions
     * - Estrae i nomi dei pokedexes
     * - Imposta la generation fornita dal chiamante
     *
     * La funzione è robusta: ogni parte della trasformazione è protetta da try/catch.
     * In caso di errore, viene usato NormalizeAndPrintError e viene restituito null.
     *
     * @param vg VersionGroup - l'oggetto originale della PokeAPI
     */
    static MapVersionGroup(vg: VersionGroup, version: Version[], lang: 'en' | 'it'): VersionDetail | null {
        try {
            if (!vg || version.length <= 0) return null;
            const versions = version.map((x) => {
                return { [x?.name]: x?.names.find(x => x?.language.name == lang) }
            }) ?? [];
            const pokedexes = Array.isArray(vg.pokedexes)
            ? vg.pokedexes
            .map(p => p?.name)
            .filter((name): name is string => Boolean(name))
            : [];
            const generation = RomanToArabic(this.SetGenerationName(vg?.generation?.name));
            return {
                versions, generation, pokedexes
            };
        } catch (err) {
            console.log(`Error during MapVersionGroup. \n${err}`);
        }
    }

    /**
     * Funzione che mappa i dati dei Pokémon per la card
     * @param param0 ({ name, id, types, sprites }) Le info del Pokémon da mappare
     * @param maxNumber (number) Il numero massimo di Pokémon
     */
    static CardPokemonMapper({ species, id, types, sprites }: Pokemon, maxNumber: number): CardPokemon {
        const name = species.name;
        const idGen = this.SetPokedexNumber(Number(id), maxNumber);
        return {
            id: idGen,
            name: name,
            href: { name: 'pokemon', params: { name, id: Number(idGen) } },
            displayName: name,
            types: this.SetTypes(types),
            src: sprites.other.home.front_default ?? sprites.front_default,
        }
    }

    /**
     * Funzione che mappa i dati dei Pokémon per la card
     * @param cardPkm (CardPokemon) Oggetto pokemon mappato per la card
     * @param pkm (PokemonSpecies) Le info della specie Pokémon da mappare
     * @param prev (Pokemon | null) Le info del Pokémon precedente da mappare se esiste
     * @param next (Pokemon | null) Le info del Pokémon successivo da mappare se esiste
     * @param count (number) Il numero massimo di Pokémon
     */
    static DetailPokemonMapper(pkm: Pokemon, pkmSpecies: PokemonSpecies, prev: Pokemon | null, next: Pokemon | null, count: number, lang: 'en' | 'it'): DetailPkm {
        try {
            const cardPkm = this.CardPokemonMapper(pkm, count);
            const genderRate = this.MapGenderRate(pkmSpecies.gender_rate);
            let nextPkm = null;
            let prevPkm = null;
            if (prev) prevPkm = this.MapDetailPokemonNav(prev, count);
            if (next) nextPkm = this.MapDetailPokemonNav(next, count);

            const genera = this.MapPkmCategory(pkmSpecies.genera, lang);
            const height = Number((pkm.height / 10).toFixed(2));
            const weight = Number((pkm.weight / 10).toFixed(2));
            const captureRate = Number(((pkmSpecies.capture_rate / 255) * 100).toFixed(2));
            const genName = this.SetGenerationName(pkmSpecies.generation.name);
            const idGen = RomanToArabic(genName);

            return {
                ...cardPkm,
                genderRate: genderRate,
                next: nextPkm,
                prev: prevPkm,
                generation: { id: idGen, name: genName, href: { name: 'generation', params: { id: idGen } }, label: `Vai alla Gen ${idGen}` },
                genera,
                size: { height: height, weight: weight, captureRate: captureRate },
                flavorText: this.MapAllFlavorTextsByLanguage(pkmSpecies, lang)
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Funzione per mappare la navbar della card dettaglio
     * @param param0 ({ species, id, sprites }: Pokemon) Info del pokemon da mappare
     * @param maxNumber (number) Il numero massimo di Pokémon attuali
     * @returns { id: string | number; name: string; src: string; href: Routing; } le info del pokemon successivo o precedente a quello visualizzato
     */
    private static MapDetailPokemonNav({ species, id, sprites }: Pokemon, maxNumber: number): { id: string | number; name: string; src: string; href: Routing; } {
        const name = species.name;
        const idPkm = this.SetPokedexNumber(Number(id), maxNumber);
        try {
            return {
                id: idPkm,
                name: name,
                src: sprites.other.home.front_default ?? sprites.front_default,
                href: { name: 'pokemon', params: { name, id: Number(idPkm) } }
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Funzione per mappare le voci pokedex
     * @param param0 ({ flavor_text_entries }: PokemonSpecies) Lista delle voci pokedex
     * @param lang La lingua desiderata
     * @returns ritorna la lista delle voci pokedex per quella lingua
     */
    private static MapAllFlavorTextsByLanguage({ flavor_text_entries }: PokemonSpecies, lang: string): { version: string; text: string; lang: string; }[] {
        return flavor_text_entries
            .filter(e => e.language.name === lang)
            .map(e => ({ version: e.version.name, text: e.flavor_text, lang: e.language.name }));
    }

    /**
     * Funzione per mappare la categoria del Pokémon
     * @param genera ({ genus: string; language: NamedApi; }[]) le categorie del Pokémon nelle varie lingue
     * @returns (string) Il nome della categoria del Pokémon
     */
    private static MapPkmCategory(genera: { genus: string; language: NamedApi; }[], lang: string): string {
        return genera.find(x => x.language.name.toLowerCase() === lang)?.genus;
    }

    /**
     * Funzione per mappare il tasso di genere del Pokémon
     * @param genderRate (number) il numero di tasso di genere espresso in ottavi
     */
    private static MapGenderRate(genderRate: number): { male: number; female: number; } | null {
        let rate = null;
        if (genderRate === 0) return rate = { male: 100, female: 0 }
        if (genderRate > 0) {
            const femaleRate = Number(((genderRate / 8) * 100).toFixed(2));
            const maleRate = Number(100 - femaleRate);
            rate = { male: maleRate, female: femaleRate }
        }
        return rate;
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
