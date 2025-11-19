export const BASE_PATH = '/pokedex';
export const LOCAL_URL: URL = new URL('http://localhost:4321');
export const SITE_TITLE = 'Pokédex';
export const LINKS = [
  { id: 'generation', label: 'Generation', href: `${BASE_PATH}/generation/` },
  { id: 'pokemon', label: 'Pokémon', href: `${BASE_PATH}/pokemon/` },
]

export const BASE_PATH_API = 'https://pokeapi.co/api/v2';
export const LINKS_API = [
  { id: 'generation', label: 'Generation', href: `${BASE_PATH_API}/generation/` },
  { id: 'pokemon', label: 'Pokémon', href: `${BASE_PATH_API}/pokemon/` },
];

export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

export const TYPE_ICONS: Record<string, string> = {
  fire: "/pokedex/types/fire.svg",
  water: "/pokedex/types/water.svg",
  grass: "/pokedex/types/grass.svg",
  electric: "/pokedex/types/electric.svg",
  ground: "/pokedex/types/ground.svg",
  bug: "/pokedex/types/bug.svg",
  dark: "/pokedex/types/dark.svg",
  dragon: "/pokedex/types/dragon.svg",
  fairy: "/pokedex/types/fairy.svg",
  fighting: "/pokedex/types/fighting.svg",
  flying: "/pokedex/types/flying.svg",
  ghost: "/pokedex/types/ghost.svg",
  ice: "/pokedex/types/ice.svg",
  normal: "/pokedex/types/normal.svg",
  poison: "/pokedex/types/poison.svg",
  psychic: "/pokedex/types/psychic.svg",
  rock: "/pokedex/types/rock.svg",
  steel: "/pokedex/types/steel.svg",
  // aggiungi tutte le altre…
};
