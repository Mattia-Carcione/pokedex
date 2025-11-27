/**
 * lib/http/apiClient
*
* Axios instance centralizzata per il progetto.
* Qui registriamo gli interceptor globali (retry, cache, logging minimale).
*/
import axios from "axios";
import type { AxiosInstance } from 'axios';
import { setupAxiosIndexedDbCache } from "../../cache/axiosIndexedDbCache";
import { retry } from "./retry";


/**
* Crea l'istanza axios centralizzata del progetto.
* L'istanza è preconfigurata per JSON, timeout e intercetta richieste e risposte.
*/
export function createApiClient(baseURL?: string): AxiosInstance {

    /**
     * axios.create(config);
     * Crea l'istanza Axios.
     *
     * config:
     * è l'oggetto di configurazione, da passare alla funzione create, 
     * che definisce come l'istanza Axios deve comportarsi per tutte le richieste
     * fatte con questa istanza.
     * 
     * timeout: number
     * Tempo massimo (in ms) prima di far fallire la richiesta.
     * 
     * responseType: json (default) | text | arraybuffer | blob | stream
     * Tipo di rsposta desiderato.
     *
     * responseEncoding: 'utf8'
     * Encoding del testo.
     * 
     * transformResponse: [(data) => any]
     * Trasforma la risposta prima che venga passata a .then()
     * 
     */
    const client = axios.create({
        baseURL,
        timeout: 15_000, // 15s default timeout
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    // aggiungi retry interceptor (esponiamo la funzione di setup per testabilità)
    retry(client);

    // setup cache basata su IndexedDB (request + response interceptor)
    setupAxiosIndexedDbCache(client);

    // eventuale logging semplice (puoi rimuoverlo o rendere condizionale)
    client.interceptors.request.use((cfg) => {
        // small debug hook
        // console.debug(`[apiClient] ${cfg.method?.toUpperCase()} ${cfg.url}`);
        return cfg;
    });

    return client;
}


// export a default client for convenience (you can override baseURL when calling createApiClient)
export const apiClient = createApiClient();