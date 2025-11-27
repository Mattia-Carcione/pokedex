import type { BaseApi, NamedApi } from "../pokeApi";

/**
 * Raggruppamento di giochi Pokémon che li separa in base ai Pokémon che includono.
 * 
 * @extends BaseApi
 * @member abilities: Elenco delle abilità introdotte in questa generazione (NamedApi[]).
 * @member main_region: La regione principale attraversata in questa generazione (NamedApi).
 * @member moves: Un elenco delle mosse introdotte in questa generazione (NamedApi[]).
 * @member names: Il nome di questa risorsa è elencato in diverse lingue ({ language: NamedApi; name: string; }[]).
 * @member pokemon_species: Elenco delle specie di Pokémon introdotte in questa generazione (NamedApi[]).
 * @member types: Elenco dei tipi introdotti in questa generazione (NamedApi[]).
 * @member version_groups: Elenco dei gruppi di versioni introdotti in questa generazione (NamedApi[]).
 */
export interface Generation extends BaseApi {
    abilities: NamedApi[];
    main_region: NamedApi;
    moves: NamedApi[];
    names: { language: NamedApi; name: string; }[];
    pokemon_species: NamedApi[];
    types: NamedApi[];
    version_groups: NamedApi[];
}