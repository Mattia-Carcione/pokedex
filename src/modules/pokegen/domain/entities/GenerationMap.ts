import { Pokemon } from "./Pokemon";

/**
 * Struttura per rappresentare i dati di una generazione di Pokémon da visualizzare.
 */
export type GenerationMap = {
    generationId: number;
    generationName: string;
    pokemon: Pokemon[];
}

/**
 * Mappa delle generazioni di Pokémon.
 * La chiave è il numero della generazione e il valore è un gruppo di Pokémon appartenenti a quella generazione.
 */
export type GenerationCollection = Map<number, GenerationMap>;