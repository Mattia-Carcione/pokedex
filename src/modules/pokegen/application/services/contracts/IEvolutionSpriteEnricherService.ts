import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

/**
 * Contratto per il servizio di arricchimento delle sprite di evoluzione dei Pokémon.
 */
export interface IEvolutionSpriteEnricherService {
    /**
     * Arricchisce le sprite di evoluzione per il Pokémon fornito.
     * @param input Il Pokémon da arricchire con le sprite di evoluzione.
     */
    enrich(input: Pokemon): Promise<void>
}
