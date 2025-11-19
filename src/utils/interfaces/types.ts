export type CardPokemon = {
    id: number;
    name: string;
    types: Type[];
    imgSrc: string;
}

export type Type = { 
    id: number; 
    name: string; 
    imgSrc: string; 
    color: string; 
}