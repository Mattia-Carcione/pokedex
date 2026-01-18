/**
 * Estrae il numero di generazione da un URL.
 * @param url - L'URL da cui estrarre il numero di generazione
 * @returns Il numero di generazione come intero
 */
export function GetGenerationNumberFromUrl(url: string): number {
    const match = url.match(/\/generation\/(\d+)\//);
    if (match && match[1])
        return parseInt(match[1], 10);
    throw new Error("L'URL della generazione non è valido.");
}