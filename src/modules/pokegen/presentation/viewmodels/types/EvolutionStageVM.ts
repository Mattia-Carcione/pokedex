/**
 * ViewModel rappresentante un'evoluzione del Pokémon.
 */
export interface PokemonEvolutionVM {
    from: string;                // Pokémon di partenza
    to: string;                  // Pokémon evoluto
    sprite: string;              // URL dello sprite del Pokémon evoluto
    minLevel?: number;           // livello minimo per evolvere (se presente)
    item?: string;               // oggetto richiesto (se presente)
    itemSprite?: string;
    gender?: string; // genere richiesto (se presente)
    timeOfDay?: string;          // momento della giornata (se presente)
    needsOverworldRain?: boolean;// indica se serve la pioggia (se presente)
    knownMove?: string;        // mossa conosciuta richiesta (se presente)
    location?: string;          // luogo richiesto (se presente)
    knownMoveType?: string;     // tipo di mossa conosciuta richiesta (se presente)
    minHappiness?: number;     // felicità minima richiesta (se presente)
    minBeauty?: number;        // bellezza minima richiesta (se presente)
    minAffection?: number;     // affetto minimo richiesto (se presente)
    relativePhysicalStats?: number; // statistiche fisiche relative richieste (se presente)
    partySpecies?: string;     // specie della party richiesta (se presente)
    partyType?: string;        // tipo della party richiesto (se presente)
    tradeSpecies?: string;     // specie di scambio richiesta (se presente)
    minMoveCount?: number;     // conteggio minimo delle mosse richiesto (se presente)
    needsMultiplayer?: boolean;   // indica se serve il moltiplicatore (se presente)
    turnUpsideDown?: boolean;    // indica se il dispositivo deve essere capovolto (se presente)
    usedMove?: string;        // mossa usata richiesta (se presente)
    href:  { name: string; params: { name: string } }
}

/**
 * ViewModel rappresentante uno stadio di evoluzione del Pokémon.
 */
export interface EvolutionStageVM {
    pokemons: { name: string; sprite?: string, href:  { name: string; params: { name: string } }};
    evolutions?: PokemonEvolutionVM[];
}
