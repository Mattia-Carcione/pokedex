import { BaseApi } from "../pokeApi";

/**
 * Interfaccia per la barra di navigazione
 * 
 * @extends BaseApi 
 * @property href string - link di riferimento
 * @property label string - descizione per l'aria-label
 */
export interface NavGen extends BaseApi {
    href: string;
    label: string;
}