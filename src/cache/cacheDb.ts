import { AxiosResponse } from "axios";
import { CachedItem, LightweightAxiosResponse } from "./types/cacheTypes";

// Costanti
const DB_NAME = 'PokemonCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'DataCacheStore';
const CACHE_LIFETIME_MS = 90 * 24 * 60 * 60 * 1000; // 90 giorni in millisecondi

/**
 * Apre il database IndexedDB.
 * Se lo store non esiste (prima apertura o aggiornamento versione), lo crea.
 * @returns {Promise<IDBDatabase>} Una Promise che risolve con l'oggetto DB.
 */
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        // [Non verificato] Controllo la disponibilità di IndexedDB nel browser.
        if (!('indexedDB' in window)) {
            console.error("IndexedDB non supportato in questo ambiente.");
            reject(new Error("IndexedDB not supported"));
            return;
        }

        const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION);

        // Gestione dell'evento di aggiornamento dello schema (prima creazione)
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            // Crea l'Object Store se non esiste
            if (!db.objectStoreNames.contains(STORE_NAME))
                db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        };

        // Gestione del successo nell'apertura
        request.onsuccess = () => resolve(request.result);

        // Gestione degli errori
        request.onerror = () => {
            console.error("IndexedDB: Errore nell'apertura del DB:", request.error);
            reject(request.error);
        };

        request.onblocked = () => console.warn("IndexedDB blocked");
    });
}

// Variabile per memorizzare l'istanza del DB una volta aperta
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Funzione di utilità per ottenere l'istanza del DB (Singleton pattern).
 * @returns {Promise<IDBDatabase>} L'oggetto DB.
 */
async function getDB(): Promise<IDBDatabase> {
    if (!dbPromise) {
        // La prima volta, apriamo il DB
        dbPromise = openDB();
    }
    return dbPromise;
}

// --- Operazioni principali di Caching ---
/**
 * Recupera un elemento dalla cache, controllando la scadenza.
 * @param {string} key La chiave di cache.
 * @returns {Promise<LightweightAxiosResponse | null>} L'oggetto risposta Axios *leggero* o null.
 */
export async function getCachedResponse<T>(key: string): Promise<LightweightAxiosResponse<T> | null> {
    try {
        const db = await getDB();
        const transaction: IDBTransaction = db.transaction([STORE_NAME], 'readonly');
        const store: IDBObjectStore = transaction.objectStore(STORE_NAME);

        // L'operazione get è sincrona sulla transazione, ma in una Promise wrapper
        const request: IDBRequest<CachedItem<T>> = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event: Event) => {
                const cachedItem = (event.target as IDBRequest<CachedItem<T>>).result;

                if (cachedItem) {
                    const now = Date.now();
                    if (now < cachedItem.expiry) resolve(cachedItem.response);
                    else resolve(null);
                } else {
                    console.log(`[Cache Miss] Nessun dato trovato per chiave: ${key}`);
                    resolve(null);
                }
            };

            request.onerror = (event: Event) => {
                console.error("Errore IndexedDB get:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    } catch (error) {
        console.error("Errore IndexedDB (getDB):", error);
        return null; // Fallback sicuro
    }
}

/**
 * Memorizza una risposta in IndexedDB con un timestamp di scadenza.
 * @param {string} key La chiave di cache.
 * @param {AxiosResponse} response L'oggetto risposta completo di Axios.
 */
export async function setCachedResponse<T>(key: string, response: AxiosResponse<T>): Promise<void> {
    try {
        const db = await getDB();
        // Transazione di tipo 'readwrite'
        const transaction: IDBTransaction = db.transaction([STORE_NAME], 'readwrite');
        const store: IDBObjectStore = transaction.objectStore(STORE_NAME);

        const expiry: number = Date.now() + CACHE_LIFETIME_MS;

        // Crea un oggetto risposta leggero da memorizzare (vedi spiegazione sotto)
        const lightweightResponse: LightweightAxiosResponse<T> = {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            // Conserviamo solo l'essenziale della config per la tracciabilità
            config: { url: response.config.url, method: response.config.method },
        };

        const itemToStore: CachedItem<T> = {
            key: key, // Usato come keyPath per lo store
            response: lightweightResponse,
            expiry: expiry,
            cachedAt: Date.now()
        };

        // Il metodo put inserisce o aggiorna l'elemento in base alla 'key'
        const request: IDBRequest = store.put(itemToStore);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();

            request.onerror = (event: Event) => {
                console.error("Errore IndexedDB set:", (event.target as IDBRequest).error);
                reject((event.target as IDBRequest).error);
            };
        });
    } catch (error) {
        console.error("Errore IndexedDB (setDB):", error);
        // La scrittura in cache non deve bloccare il flusso principale
    }
}