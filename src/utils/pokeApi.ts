import { LINKS_API } from "../const.ts";
import { MapCardPokemon, MapGeneration } from "./helper.ts";
import type { CardPokemon } from "./interfaces/types.ts";

async function safeFetch(url: string, retries = 5) {
  try {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url);
        if (res.ok) return res;
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        throw new Error(`safeFetch Failed to fetch after ${retries} attempts: ${url}. \n ${err}`);
      } finally {
        continue;
      }
    }
  } catch (err) {
    throw new Error(`${err}`);
  }
}

export async function fetchGenerations(): Promise<any> {
  try {
    const res = await safeFetch(`${LINKS_API.find(x => x.id == 'generation')?.href}`);
    if (!res || !res.ok) throw new Error(`Failed to fetch generations: ${res}`);
    return MapGeneration(res.json());
  } catch (err) {
    throw new Error(`fetchGenerations Failed to fetch generations: ${err}`);
  }
}

export async function fetchGenerationById(id: string = "1"): Promise<any> {
  try {
    const res = await safeFetch(`${LINKS_API.find(x => x.id == 'generation')?.href}/${id}`);
    if (!res || !res.ok) throw new Error('Failed to fetch generation');
    return res.json();
  } catch (err) {
    throw new Error(`fetchGenerationById failed to fetch generations: ${id}. \n Error: ${err}`);
  }
}

export async function fetchPokemonByIdOrName(idOrName: string = ""): Promise<CardPokemon> {
  try {
    const res = await safeFetch(`${LINKS_API.find(x => x.id == 'pokemon')?.href}${idOrName}`);
    if (!res || !res.ok) throw new Error('Failed to fetch pokemon ' + res);
    return MapCardPokemon(res.json());
  } catch (err) {
    throw new Error(`fetchPokemonByIdOrName failed to fetch generations: ${idOrName}. \n Error: ${err}`);
  }
}

export async function fetchPokemonByUrl(url: string = ""): Promise<CardPokemon> {
  const fetchUrl = url.replace("-species", "");
  try {
    const res = await safeFetch(fetchUrl);
    if (!res || !res.ok) throw new Error(`Failed to fetch pokemon: ${fetchUrl} (status ${res})`);
    return MapCardPokemon(res.json());
  } catch (err) {
    throw new Error(`fetchPokemonByUrl failed for URL: ${fetchUrl}.\n Error: ${err}`);
  }
}

export async function fetchAllByGeneration(pokemonData: []): Promise<CardPokemon[]> {
  try {
    return Promise.all(pokemonData.map(async (p: any) => {
      try {
        return await fetchPokemonByUrl(p.url);
      } catch (err) {
        throw new Error(`fetchAllByGeneration failed for URL: ${p.url}.\n Error: ${err}`);
      }
    }));
  } catch (err) {
    throw new Error(`fetchAllByGeneration failed.\n Error: ${err}`);
  }
}