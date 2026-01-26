/**
 * Esegue una fetch sicura di un endpoint numerico, restituendo null in caso di errore o input non valido.
 * @param input - L'input numerico per l'endpoint
 * @param fetcher - La funzione di fetch da utilizzare
 * @returns Una promessa che risolve il risultato della fetch o null
 */
export async function safeFetch<T>(input: number, fetcher: (endpoint: string) => Promise<T>): Promise<T | null> {
    if (input <= 0) return null;
    try {
        return await fetcher(input.toString());
    } catch (error) {
        return null;
    }
}