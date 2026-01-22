/**
 * Configurazione aggiuntiva per le richieste che supportano la cache.
 *
 * @property cacheTTL - Tempo di vita della cache in secondi. Se non specificato, viene utilizzato il valore predefinito.
 * @property cache - Abilita o disabilita la cache per questa richiesta. Valore predefinito: true.
 */
export interface CacheRequestConfig {
    cacheTTL?: number;
    /** enable/disable cache */
    cache?: boolean;
}