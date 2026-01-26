/**
 * Dettagli dell'evoluzione di un Pokémon.
 * @property min_level (number | null) - il livello minimo per l'evoluzione
 * @property trigger ({ name: string; url: string }) - il trigger dell'evoluzione
 * @property item ({ name: string; url: string } | null) - l'oggetto richiesto per l'evoluzione
 * @property gender (number | null) - il genere richiesto per l'evoluzione
 * @property location ({ name: string; url: string } | null) - la location richiesta per l'evoluzione
 * @property held_item ({ name: string; url: string } | null) - l'oggetto tenuto richiesto per l'evoluzione
 * @property time_of_day (string) - il momento della giornata richiesto per l'evoluzione
 * @property needs_overworld_rain (boolean) - indica se è necessaria la pioggia per l'evoluzione
 * @property [key: string]: any - per eventuali altri campi dell'API
 */
export interface EvolutionDetail {
    min_level: number | null;
    trigger: { name: string; url: string };
    item: { name: string; url: string } | null;
    gender: number | null;
    location: { name: string; url: string } | null;
    held_item: { name: string; url: string } | null;
    time_of_day: string;
    needs_overworld_rain: boolean;
    [key: string]: any; // per eventuali altri campi dell'API
}

/**
 * Nodo della catena evolutiva.
 * @property species ({ name: string; url: string }) - la specie del Pokémon
 * @property details (EvolutionDetail[]) - i dettagli dell'evoluzione
 * @property evolves_to (EvolutionNode[]) - i nodi delle evoluzioni successive
 */
export interface EvolutionNode {
    species: { name: string; url: string };
    details: EvolutionDetail[];
    evolves_to: EvolutionNode[];
}