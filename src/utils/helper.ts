import { TYPE_ICONS, TYPE_COLORS } from "../const";
import type { CardPokemon, Type } from "./interfaces/types";

export function Sort(data: []): [] {
  return data.sort((a: any, b: any) => {
    const idA = Number(a.url.split("/").filter(Boolean).pop());
    const idB = Number(b.url.split("/").filter(Boolean).pop());
    return idA - idB;
  })
}

export async function MapCardPokemon(pokemonPromise: Promise<any>): Promise<CardPokemon> {
  const pokemon = await pokemonPromise;
  if (!pokemon)
    throw new Error("MapCardPokemon received empty pokemon data");

  const types: Type[] = SetTypes(pokemon.types);
  const id = SetPokedexNumber(pokemon.id);

  return {
    id: id,
    name: pokemon.name,
    types,
    imgSrc: pokemon.sprites?.other?.home?.front_default ?? pokemon.sprites?.front_default ?? "/images/placeholder.png",
  };
}

function SetTypes(types: []): Type[] {
  return types.map((t: any, index: number) => {
    const name = t.type.name;
    return {
      id: index + 1,
      name,
      imgSrc: TYPE_ICONS[name] ?? "",
      color: TYPE_COLORS[name] ?? "#999999"
    };
  })
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