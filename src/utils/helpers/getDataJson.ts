const files = import.meta.glob('../../data/*.json', {
    import: 'default',
});
import type { NameUrl } from "../interfaces/types";
import { FetchAndWrite } from "./createJson";
import { isDateWithinSixMonth } from "./dateUtility.ts";
import { Sort } from "./utils.ts";

export async function getPokemonData(data: NameUrl[] | undefined, src: string, isSpecies: boolean = false) {

    if (!data)
        return;
    try {
        const entry = Object.entries(files).find(([path]) =>
            path.endsWith(src)
        );
        if (entry && isDateWithinSixMonth()) {
            const [, loader] = entry;
            return await loader();
        }
        data = Sort(data);
        return await FetchAndWrite(src, data, isSpecies);

    } catch (error) {
        console.error("Errore in getSpeciesData:", error);
        throw error;
    }
}