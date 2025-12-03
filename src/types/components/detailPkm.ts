import { Routing } from "../routing";
import { CardPokemon } from "./cardPokemon";

/**
 * Oggetto per la card dettaglio del Pokémon
 */
export interface DetailPkm extends CardPokemon {
    genderRate: { male: number; female: number; } | null;
    next: { id: number; name: string; src: string; href: Routing; } | null;
    prev: { id: number; name: string; src: string; href: Routing; } | null;
    generation: string;
    genera: string;
    size: { height: number; weight: number; captureRate: number; }
}