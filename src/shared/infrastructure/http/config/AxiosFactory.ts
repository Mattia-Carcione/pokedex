import axios, { AxiosInstance } from 'axios';
import { RetryAxiosRequestConfig } from '../types/AxiosExtendedTypes';
import { DEFAULT_OPTS } from './AxiosConfig';
import { Retry } from '../interceptors/HttpRetry';
import { setAxiosRequestCache } from '../interceptors/HttpGetCahce';
import { setAxiosResponseCache } from '../interceptors/HttpSetCache';

/**
 * Creazione dell'istanza di axios, con interceptor, retry e get/set in cache.
 */
export function CreateApiClient(baseUrl?: string, opts: RetryAxiosRequestConfig = DEFAULT_OPTS): AxiosInstance {

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
  const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000, // default timeout di 5s
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    }, //default content type accettato
  });

  Retry(apiClient, opts);

  setAxiosRequestCache(apiClient);
  
  setAxiosResponseCache(apiClient);

  return apiClient;
}