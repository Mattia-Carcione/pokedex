/**
 * Interfaccia base della pokeApi
 * 
 * @property id - Identificatore di questa risorsa (integer).
 * @property name - Nome di questa risorsa (string).
 */
export interface BaseApi {
    id: number | string;
    name: string;
}

/**
 * Nome e URL della risorsa disponibile per quell'api
 * 
 * @property name: Il nome della risorsa referenziata (string).
 * @property url: L'URL della risorsa referenziata (string).
 */
export interface NamedApi {
    name: string;
    url: string;
}

export interface Names {
    language: NamedApi; 
    name: string;
}

/**
 * Elenco paginato delle risorse disponibili per quell'API
 * 
 * @property count: Numero totale di risorse disponibili da questa API (number).
 * @property next: L'URL per la pagina successiva nell'elenco (string | null).
 * @property previous: L'URL della pagina precedente nell'elenco (string | null).
 * @property results: Un elenco di risorse API denominate (NamedApi[]).
 */
export interface PokeApi {
    count: number;
    next: string | null;
    previous: string | null;
    results: NamedApi[];
}