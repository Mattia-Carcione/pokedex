import { RetryEnum } from "../enums/RetryEnum";

/**
 * Estensione dell'oggetto Config per il retry.
 * 
 * L'oggetto Config:
 * 
 * Permette di personalizzare ogni aspetto della richiesta URL:
 * - axios.get(url, config)
 * 
 * Permette di configurare le istanze del client:
 * 
 * L'oggetto di estensione Config per il retry aggiunge attributi necessari per il retry.
 * 
 * - retry? (number) - numero di tentativi da eseguire.
 * - retryDelay? (number) - ritardo tra un tentativo e l'altro.
 * - __retryCount? (number) - contatore di tentativi effettuati.
 * - jitter? ('none', 'equal', 'full', 'decorreleted') - ritardo casuale.
 * 
 */
export interface RetryRequestConfig {
    /**
     * numero di tentativi da eseguire.
     */
    retry: number;
    /**
     * ritardo in ms tra un tentativo e l'altro.
     */
    retryDelay: number;
    /**
     * contatore di tentativi effettuati.
     */
    __retryCount?: number;
    /**
     * Variazione casuale aggiunta al tempo di attesa calcolato dal backoff
     */
    jitter: RetryEnum.FULL | RetryEnum.EQUAL | RetryEnum.DECORRELATED | RetryEnum.NONE;
}