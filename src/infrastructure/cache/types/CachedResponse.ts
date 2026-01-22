/**
* types/cache
* Tipi condivisi per la cache
*/
export type CachedResponse = {
    /** payload originale di axios response.data */
    data: any;
    /** headers ricevuti */
    headers: Record<string, any>;
    /** status code (es. 200) */
    status: number;
    /** timestamp ms di quando è stata salvata */
    savedAt: number;
    /** opzionale expiresAt ms per invalidazione */
    expiresAt: number | null;
};