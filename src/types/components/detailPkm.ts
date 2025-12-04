import { Routing } from "../routing";
import { CardPokemon } from "./cardPokemon";
import { NavGen } from "./navGen";

/**
 * Oggetto per la card dettaglio del Pokémon
 */
export interface DetailPkm extends CardPokemon {
    genderRate: { male: number; female: number; } | null;
    next: { id: number; name: string; src: string; href: Routing; } | null;
    prev: { id: number; name: string; src: string; href: Routing; } | null;
    generation: NavGen;
    genera: string;
    size: { height: number; weight: number; captureRate: number; };
    flavorText: { version: string; text: string; lang: string; }[];
}

/**
 * Interfaccia delle versioni dei giochi e generazioni
 */
export interface VersionDetail {
    generation: string | number; 
    versions: string[]; 
    pokedexes: string[];
}