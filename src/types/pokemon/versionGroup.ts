import { BaseApi, NamedApi } from "../pokeApi";

export interface VersionGroup extends BaseApi {
    generation: NamedApi;
    move_learn_methods: NamedApi[];
    order: number;
    pokedexes: NamedApi[];
    regions: NamedApi[];
    versions: NamedApi[];
}