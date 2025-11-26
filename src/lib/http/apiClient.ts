import axios from "axios";

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
export const pokeApi = axios.create({
    timeout: 8000,
    responseType: "json",
    responseEncoding: "utf8",
    transformResponse: [(data) => {
        return JSON.parse(data);
    }]
});