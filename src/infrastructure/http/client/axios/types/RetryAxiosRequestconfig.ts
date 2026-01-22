import { AxiosRequestConfig } from 'axios';
import { RetryRequestConfig } from "../../../types/RequestConfig";

/**
 * Estensione dell'oggetto Config di axios per il retry.
 * 
 * L'oggetto Config:
 * 
 * Permette di personalizzare ogni aspetto della richiesta URL:
 * - axios.get(url, config)
 * 
 * Permette di configurare le istanze di axios create:
 * - axios.create(config)
 * 
 * Permette di essere manipolato dagli intercettori di richiesta axios.
 * 
 * L'oggetto di estensione Config per il retry aggiunge attributi necessari per il retry.
 * 
 * - retry? (number) - numero di tentativi da eseguire.
 * - retryDelay? (number) - ritardo tra un tentativo e l'altro.
 * - __retryCount? (number) - contatore di tentativi effettuati.
 * - jitter? ('none', 'equal', 'full', 'decorreleted') - ritardo casuale.
 * 
 * @extends AxiosRequestConfig
 * @extends RetryRequestConfig
 */
export interface RetryAxiosRequestConfig extends AxiosRequestConfig, RetryRequestConfig {}