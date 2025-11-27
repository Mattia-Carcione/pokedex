/** 
 * sleep(ms: number): Promise<void> 
 * è una funzione che ritorna una Promise risolta dopo ms millisecondi. 
 * Serve per sospendere asincronamente l’esecuzione 
 * (in retry viene usata per attendere tra i tentativi).
 */
export function sleep(ms: number,): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
}