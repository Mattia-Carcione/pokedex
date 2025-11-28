import { BaseApi } from "../pokeApi";
import { TypePkm } from "./typePkm";

/**
 * Interfaccia per la card Pokémon
 * 
 * @extends BaseApi
 * @property displayName (string) - il nome visualizzato in pagina
 * @property src (string) - il percorso dello sprite 
 * @property type (TypePkm[]) - il tipo del pokémon
 */
export interface CardPokemon extends BaseApi {
    displayName: string;
    types: TypePkm[];
    src: string;
}