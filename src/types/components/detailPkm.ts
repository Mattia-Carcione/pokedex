import { Routing } from "../routing";
import { CardPokemon } from "./cardPokemon";

export interface DetailPkm extends CardPokemon {
    genderRate: { male: number; female: number; } | null;
    next: { id: number; name: string; src: string; href: Routing; } | null;
    prev: { id: number; name: string; src: string; href: Routing; } | null;
    generation: string;
}