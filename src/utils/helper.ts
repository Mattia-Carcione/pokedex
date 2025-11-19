import { TYPE_ICONS, TYPE_COLORS, LINKS } from "../const";
import type { CardPokemon, Type, Generation } from "./interfaces/types";

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

export async function MapCardPokemon(pokemonPromise: Promise<any>): Promise<CardPokemon> {
  try {
    const pokemon = await pokemonPromise;
    const name: string = pokemon.species.name.toString();
    if (!pokemon)
      throw new Error("MapCardPokemon received empty pokemon data");
  
    const types: Type[] = SetTypes(pokemon.types);
    const id = SetPokedexNumber(pokemon.id);
  
    return {
      id: id,
      name: name,
      types,
      imgSrc: pokemon.sprites?.other?.home?.front_default ?? pokemon.sprites?.front_default ?? "/images/placeholder.png",
    };
  } catch (err) {
    throw new Error(`MapCardPokemon failed. \n Error: ${err}`);
  }
}

export async function MapGeneration(generationPromise: Promise<any>): Promise<Generation[]> {
  try {
    const generations = await generationPromise;
    if (!generations)
      throw new Error("MapGeneration received empty generation data");
    return generations.results.map((g: any, x: number) => {
      try {
        const name: string = g.name.split("-")[g.name.split("-").length - 1];
        const href = LINKS.find(x => x.id == "generation")?.href ?? "";
        return {
          id: x + 1,
          name: name.toUpperCase(),
          href: href + (x+1)
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

function SetPokedexNumber(value: any): any {
  if (value < 100) {
    if (value < 10)
      return value = "00" + value;
    else
      return value = "0" + value;
  } else
    return value;
}