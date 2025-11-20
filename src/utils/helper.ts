import { TYPE_ICONS, TYPE_COLORS, LINKS } from "../const";
import type { CardPokemon, Type, Generation, Pokemon, GenerationCard, NameUrl } from "./interfaces/types";
import { fetchAllByGeneration, fetchGenerationById, fetchPokemonByUrl } from "./pokeApi";

export function Sort(data: []): [] {
  try {
    return data.sort((a: any, b: any) => {
      try {
        const idA = Number(a.url.split("/").filter(Boolean).pop());
        const idB = Number(b.url.split("/").filter(Boolean).pop());
        return idA - idB;
      } catch (err) {
        throw new Error(`Sort failed sorting: ${a} and ${b}. \n Error: ${err}`);
      }
    });
  } catch (err) {
    throw new Error(`Sort failed. \n Error: ${err}`);
  }
}

export function MapCardPokemon(pokemon: Pokemon): CardPokemon {
  try {
    if (!pokemon)
      throw new Error("MapCardPokemon received empty pokemon data");
    const name: string = pokemon.species.name;
  
    const types: Type[] = SetTypes(pokemon.types as []);
    const id = SetPokedexNumber(pokemon.id);
  
    return {
      id: id,
      name: name,
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      types,
      imgSrc: pokemon.sprites.other.home.front_default ?? pokemon.sprites.front_default,
    };
  } catch (err) {
    throw new Error(`MapCardPokemon failed. \n Error: ${err}`);
  }
}

export async function MapGenerationToCard(gen: Generation): Promise<GenerationCard[]> {
  try {
    if (!gen)
      throw new Error("MapGeneration received empty generation data");
    return gen.results.map((g, x) => {
      try {
        const name: string = g.name.split("-")[g.name.split("-").length - 1];
        const href = LINKS.find(x => x.id == "generation")?.href ?? "";
        return {
          id: x + 1,
          name: name.toUpperCase(),
          href: href + (x+1),
          count: gen.count,
          results: gen.results
        };
      } catch (err) {
        throw Error(`MapGeneration failed mapping: ${g.name}. \n Error: ${err}`);
      }
    });
  } catch (err) {
    throw Error(`MapGeneration failed. \n Error: ${err}`);
  }
}

function SetTypes(types: []): Type[] {
  try {
    return types.map((t: any, index: number) => {
      try {
        const name = t.type.name;
        return {
          id: index + 1,
          name,
          imgSrc: TYPE_ICONS[name] ?? "",
          color: TYPE_COLORS[name] ?? "#999999"
        };
      } catch (err) {
        throw Error(`SetTypes failed setting: ${t.name}. \n Error: ${err}`);
      }
    });
  } catch (err) {
    throw Error(`SetTypes failed. \n Error: ${err}`);
  }
}

function SetPokedexNumber(value: number): any {
  if (value < 1000) {
    if (value < 100)
      return "000" + value;
    else
      return "0" + value;
  } else
    return value;
}

export async function GetPreviousOrNext(name: string, data: NameUrl[], input: any, isNext: boolean = false): Promise<CardPokemon | undefined> {
  const index = data.findIndex(item =>
    item.name === name);

  if(isNext && data[index + 1]?.name)
    return MapCardPokemon(await fetchPokemonByUrl(data[index + 1]?.url) as Pokemon);

  if(!isNext && data[index - 1]?.name)
    return MapCardPokemon(await fetchPokemonByUrl(data[index - 1]?.url) as Pokemon);

  if(input.id >= input.count)
    return;

  if(isNext)
    return await FetchPrevOrNextPokemon((input.id + 1), 0);

  if((input.id - 1) <= 0)
    return;

  return await FetchPrevOrNextPokemon(input.id - 1);
}

async function FetchPrevOrNextPokemon(id: number, length?: number | null) {
  const gen = await fetchGenerationById(id);
  const pokemons = await fetchAllByGeneration(gen.pokemon_species) as Pokemon[];
  const pokemon: CardPokemon[] = pokemons.map((p) => (MapCardPokemon(p)));
  return pokemon[length ?? gen.pokemon_species.length - 1];
}