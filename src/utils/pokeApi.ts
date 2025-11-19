import { LINKS_API } from "../const.ts";
import { MapCardPokemon, MapGeneration } from "./helper.ts";
import type { CardPokemon } from "./interfaces/types.ts";

export async function fetchGenerations(): Promise<any> {
  try {
    const res = await fetch(`${LINKS_API.find(x => x.id == 'generation')?.href}`);
    if (!res.ok) throw new Error(`Failed to fetch generations: ${res}`);
    return MapGeneration(res.json());
  } catch {
    throw new Error('Failed to fetch generations');
  }
}

export async function fetchGenerationById(id: string = "1"): Promise<any> {
  const res = await fetch(`${LINKS_API.find(x => x.id == 'generation')?.href}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch generation');
  return res.json();
}

export async function fetchPokemonByIdOrName(idOrName: string = ""): Promise<CardPokemon> {
  const res = await fetch(`${LINKS_API.find(x => x.id == 'pokemon')?.href}${idOrName}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon ' + res);
  return MapCardPokemon(res.json());
}

export async function fetchPokemonByUrl(url: string = ""): Promise<CardPokemon> {
  try {
  const fetchUrl = url.replace("-species", "");
  const res = await fetch(fetchUrl);
  if (!res.ok) throw new Error('Failed to fetch pokemon: ' + fetchUrl);
  return MapCardPokemon(res.json());
  } catch {
    throw new Error('Failed to fetch pokemon in fetchPokemonByUrl');
  }
}

export async function fetchAllByGeneration(pokemonData: []): Promise<CardPokemon[]> {
  try {
    return Promise.all(pokemonData.map(async (p: any) => {
      return await fetchPokemonByUrl(p.url);
    }));
  } catch {
    throw new Error('Failed to fetch pokemon ' + pokemonData);
  }
}