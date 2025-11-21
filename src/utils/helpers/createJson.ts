import fs from "node:fs";
import path from "path";
import { FetchPokemonByUrl } from "../ApiFetch/pokeApi";
import type { NameUrl } from "../interfaces/types";

function CreateFileJson(src: string, data: string): void {
    try {
        const dir = path.dirname(src);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(src, data);
    } catch (err) {
        throw new Error(`CreateFileJson failed writing to ${src}. \nError: ${err}`);
    }
}

export async function FetchAndWrite(src: string, data: NameUrl[], isSpecies: boolean = false): Promise<any> {
    const pokemonData = await Promise.all(data.map(async ({ url }) => {
        return await FetchPokemonByUrl(url, isSpecies);
    }));
    const pokemon = pokemonData.flat();
    const fullPath = path.join(process.cwd(), "src/data", src);
    CreateFileJson(fullPath, JSON.stringify(pokemon, null, 2));
    return pokemon;
}