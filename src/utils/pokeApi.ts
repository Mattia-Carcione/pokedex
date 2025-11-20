import { LINKS_API } from "../const.ts";
import { cachedFetch } from "./caching/cache.ts";
import { MapGenerationToCard, Sort } from "./helper.ts";
import type { Generation, GenerationCard, GenerationInfo, NameUrl, Pokemon, PokemonSpecies } from "./interfaces/types.ts";

async function safeFetch(url: string, retries = 5) {
  let error;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (err) {
      error = err;
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`safeFetch Failed after ${retries} attempts: ${url}\n${error}`);
}

export async function fetchGenerations(): Promise<GenerationCard[]> {
  try {
    return cachedFetch("generations", async () => {
      const res = await safeFetch(`${LINKS_API.find(x => x.id == 'generation')?.href}`);
      if (!res.ok) throw new Error(`Failed to fetch generations: ${res.status}`);
      const data = await res.json() as Generation;
      return MapGenerationToCard(data);
    });
  } catch (err) {
    throw new Error(`fetchGenerations Failed to fetch generations: ${err}`);
  }
}

export async function fetchGenerationById(id: number = 1): Promise<GenerationInfo> {
  try {
    return cachedFetch(`generation_${id}`, async () => {
      const res = await safeFetch(`${LINKS_API.find(x => x.id == 'generation')?.href}${id}`);
      if (!res.ok) throw new Error(`fetchGenerationById Failed to fetch generation: ${res.status}`);
      const data = await res.json() as GenerationInfo;
      data.pokemon_species = Sort(data.pokemon_species as []);
      return data;
    });
  } catch (err) {
    throw new Error(`fetchGenerationById failed to fetch generations: ${id}. \n Error: ${err}`);
  }
}

export async function fetchPokemonByIdOrName(idOrName: string = ""): Promise<Pokemon> {
  try {
    return cachedFetch(`pokemon_${idOrName}`, async () => {
      const res = await safeFetch(`${LINKS_API.find(x => x.id == 'pokemon')?.href}${idOrName}`);
      if (!res.ok) throw new Error(`fetchPokemonByIdOrName Failed to fetch pokemon: ${res.status}`);
      return await res.json() as Pokemon;
    });
  } catch (err) {
    throw new Error(`fetchPokemonByIdOrName failed to fetch generations: ${idOrName}. \n Error: ${err}`);
  }
}

export async function fetchPokemonByUrl(url: string = "", isSpecies: boolean = false): Promise<Pokemon | PokemonSpecies> {
  const fetchUrl = isSpecies ? url : url.replace("-species", "");
  try {
    return cachedFetch(`pokemon_url_${fetchUrl}`, async () => {
      const res = await safeFetch(fetchUrl);
      if (!res.ok) throw new Error(`fetchPokemonByUrl Failed to fetch pokemon: ${fetchUrl} (status ${res.status})`);
      if(isSpecies)
        return await res.json() as PokemonSpecies;
      return await res.json() as Pokemon;
    });
  } catch (err) {
    throw new Error(`fetchPokemonByUrl failed for URL: ${fetchUrl}.\n Error: ${err}`);
  }
}

export async function fetchAllByGeneration(pokemonData: NameUrl[]): Promise<Pokemon[]> {
  try {
    return Promise.all(pokemonData.map(async (p) => {
      try {
        return await fetchPokemonByUrl(p.url, false) as Pokemon;
      } catch (err) {
        throw new Error(`fetchAllByGeneration failed for URL: ${p.url}.\n Error: ${err}`);
      }
    }));
  } catch (err) {
    throw new Error(`fetchAllByGeneration failed.\n Error: ${err}`);
  }
}