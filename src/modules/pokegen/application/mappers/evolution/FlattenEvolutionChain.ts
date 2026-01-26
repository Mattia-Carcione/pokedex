import { ChainLinkDto, EvolutionChainDto } from "@/modules/pokegen/data/models/dtos/EvolutionChainDto";
import { EvolutionDetail } from "@/modules/pokegen/data/models/types/EvolutionNode";

/**
     * Appiattisce la catena evolutiva in un array di oggetti PokemonEvolution.
     * @param dto La catena evolutiva da appiattire.
     * @returns Un array di oggetti PokemonEvolution.
     */
export function flattenEvolutionChain(dto: EvolutionChainDto): {
    from: string;
    to: string;
    details: EvolutionDetail[];
}[] {

    if (!dto || !dto.chain)
        throw Error("[flattenEvolutionChain] - Error during Pokémon Evolution mapping: Missing required properties.");

    const result: { from: string; to: string; details: EvolutionDetail[]; }[] = [];

    const traverse = (node: ChainLinkDto, fromName?: string) => {
        if (fromName) {
            result.push({
                from: fromName,
                to: node.species.name,
                details: node.evolution_details || []
            });
        }
        node.evolves_to.forEach(child => (traverse(child, node.species.name)))
    };
    traverse(dto.chain);
    return result;
}