import type { BaseApi, NamedApi, Names } from "../pokeApi";

/**
 * Raggruppamento di giochi Pokémon che li separa in base ai Pokémon che includono.
 * 
 * @extends BaseApi
 * @property abilities: Elenco delle abilità introdotte in questa generazione (NamedApi[]).
 * @property main_region: La regione principale attraversata in questa generazione (NamedApi).
 * @property moves: Un elenco delle mosse introdotte in questa generazione (NamedApi[]).
 * @property names: Il nome di questa risorsa è elencato in diverse lingue ({ language: NamedApi; name: string; }[]).
 * @property pokemon_species: Elenco delle specie di Pokémon introdotte in questa generazione (NamedApi[]).
 * @property types: Elenco dei tipi introdotti in questa generazione (NamedApi[]).
 * @property version_groups: Elenco dei gruppi di versioni introdotti in questa generazione (NamedApi[]).
 */
export interface Generation extends BaseApi {
    abilities: NamedApi[];
    main_region: NamedApi;
    moves: NamedApi[];
    names: Names[];
    pokemon_species: NamedApi[];
    types: NamedApi[];
}