/**
 * Interfaccia base della pokeApi
 * 
 * @member id - Identificatore di questa risorsa (integer).
 * @member name - Nome di questa risorsa (string).
 */
export interface BaseApi {
    id: number;
    name: string;
}

/**
 * Nome e URL della risorsa disponibile per quell'api
 * 
 * @member name: Il nome della risorsa referenziata (string).
 * @member url: L'URL della risorsa referenziata (string).
 */
export interface NamedApi {
    name: string;
    url: string;
}

/**
 * Elenco paginato delle risorse disponibili per quell'API
 * 
 * @member count: Numero totale di risorse disponibili da questa API (number).
 * @member next: L'URL per la pagina successiva nell'elenco (string | null).
 * @member previous: L'URL della pagina precedente nell'elenco (string | null).
 * @member results: Un elenco di risorse API denominate (NamedApi[]).
 */
export interface ListApi {
    count: number;
    next: string | null;
    previous: string | null;
    results: NamedApi[];
}