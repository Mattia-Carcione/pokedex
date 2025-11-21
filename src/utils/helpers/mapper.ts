import { TYPE_ICONS, TYPE_COLORS, LINKS } from "../../const";
import type { Pokemon, CardPokemon, Type, PokeApi, GenerationCard } from "../interfaces/types";

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

export async function MapGenerationToCard(gen: PokeApi[]): Promise<GenerationCard[]> {
  try {
    if (!gen)
      throw new Error("MapGeneration received empty generation data");
    return gen.map((res) => res.results.map((g, x) => {
      try {
        const name: string = g.name.split("-")[g.name.split("-").length - 1];
        const href = LINKS.find(x => x.id == "generation")?.href ?? "";
        return {
          id: x + 1,
          name: name.toUpperCase(),
          href: href + (x+1),
          count: res.count,
          results: res.results
        };
      } catch (err) {
        throw Error(`MapGeneration failed mapping: ${g.name}. \n Error: ${err}`);
      }
    })).flat();
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