import { DetailPkm } from "@/types/components/detailPkm";

/**
 * Funzione per mappare le versioni con i testi delle voci pokedex
 * @param generationObj ({ generation: number; versions: string[]; }) l'oggetto presente nello store
 * @param flavorTexts ({ flavorText }: DetailPkm) Le voci pokedex mappate del pokemon
 * @returns 
 */
export function mapVersionsWithText(generationObj: { generation: number; versions: string[]; }, { flavorText }: DetailPkm) {
    return generationObj.versions.map(ver => {
        const match = flavorText.find(f => f.version === ver);
        return {
            version: match ? match.version : null,
            text: match ? match.text : null
        };
    });
}
