import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

export interface IEvolutionSpriteEnricherService {
    enrich(input: Pokemon): Promise<void>
}
