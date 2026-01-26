import { ChainLinkDto, EvolutionChainDto } from "@/modules/pokegen/data/models/dtos/EvolutionChainDto";

/**
 * Estrae i nomi delle specie da una catena evolutiva.
 * @param dto La catena evolutiva da analizzare.
 * @returns Un insieme di nomi delle specie.
 */
export function extractSpeciesNamesFromEvolution(
    dto: EvolutionChainDto
): Set<string> {
    const names = new Set<string>();

    const traverse = (node: ChainLinkDto) => {
        names.add(node.species.name);
        node.evolves_to.forEach((child: ChainLinkDto) => traverse(child));
    };

    traverse(dto.chain);
    return names;
}
