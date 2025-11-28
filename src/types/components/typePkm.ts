import { BaseApi } from "../pokeApi";

/**
 * @extends BaseApi 
 * @property src (string) - il percorso dell'img
 * @property color (string) - l'esadecimale corrispondente al tipo
 */
export interface TypePkm extends BaseApi {
    src: string;
    color: string;
}