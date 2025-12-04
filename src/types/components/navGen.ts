import { BaseApi } from "../pokeApi";
import { Routing } from "../routing";

/**
 * Interfaccia per la barra di navigazione
 * 
 * @extends BaseApi 
 * @property href string - link di riferimento
 * @property label string - descizione per l'aria-label
 */
export interface NavGen extends BaseApi {
    href: Routing;
    label: string;
}