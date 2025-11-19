export const BASE_PATH = '/pokedex-astro';
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
  fire: `${BASE_PATH}/types/fire.svg`,
  water: `${BASE_PATH}/types/water.svg`,
  grass: `${BASE_PATH}/types/grass.svg`,
  electric: `${BASE_PATH}/types/electric.svg`,
  ground: `${BASE_PATH}/types/ground.svg`,
  bug: `${BASE_PATH}/types/bug.svg`,
  dark: `${BASE_PATH}/types/dark.svg`,
  dragon: `${BASE_PATH}/types/dragon.svg`,
  fairy: `${BASE_PATH}/types/fairy.svg`,
  fighting: `${BASE_PATH}/types/fighting.svg`,
  flying: `${BASE_PATH}/types/flying.svg`,
  ghost: `${BASE_PATH}/types/ghost.svg`,
  ice: `${BASE_PATH}/types/ice.svg`,
  normal: `${BASE_PATH}/types/normal.svg`,
  poison: `${BASE_PATH}/types/poison.svg`,
  psychic: `${BASE_PATH}/types/psychic.svg`,
  rock: `${BASE_PATH}/types/rock.svg`,
  steel: `${BASE_PATH}/types/steel.svg`,
  // aggiungi tutte le altre…
};
