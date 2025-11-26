/** 
 * sleep(ms: number, signal?: AbortSignal): Promise<void> 
 * è una funzione che ritorna una Promise risolta dopo ms millisecondi. 
 * Serve per sospendere asincronamente l’esecuzione 
 * (in retry viene usata per attendere tra i tentativi).
 *
 * AbortSignal
 * Serve per poter interrompere l'attesa se l'utente cancella.
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
        const id = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve();
        }, ms);
        function onAbort() {
            clearTimeout(id);
            reject(new DOMException('Aborted', 'AbortError'));
        }
        signal?.addEventListener('abort', onAbort);
    });
}

/**
 * 
 * La funzione applyJitter serve a introdurre casualità sui ritardi calcolati
 * per evitare che se molti utenti falliscono nello stesso istante,
 * venga rifatta la stessa richiesta di tutti gli utenti che hanno fallito
 * nello stesso istante.
 * 
 * @param calculatedDelay number
 * è il ritardo calcolato.
 * @param prevDelay number
 * il numero espresso in ms di ritardo precednete.
 * @param jitter 'none' | 'full' | 'equal' | 'decorrelated'
 * è la casualità sui ritardi calcolati.
 * @param baseDelay number
 * è il ritardo in ms minimo.
 * @param maxDelay number
 * è il ritardo in ms massimo.
 * @returns 
 * ritorna il numero di casualità calcolato sul ritardo.
 */
function applyJitter(calculatedDelay: number, prevDelay: number | undefined, jitter: 'none' | 'full' | 'equal' | 'decorrelated', baseDelay = 100, maxDelay = 10000): number {

    switch (jitter) {
        case 'decorrelated':
            const min = baseDelay;
            const max = Math.min(maxDelay, Math.max(calculatedDelay, prevDelay ?? calculatedDelay));
            const low = Math.floor(min);
            const high = Math.floor((prevDelay ? prevDelay * 3 : calculatedDelay));
            const candidate = Math.floor(Math.random() * (high - low + 1) + low);
            return Math.min(max, candidate);

        case 'full':
            return Math.floor(Math.random() * calculatedDelay);

        case 'equal':
            const half = Math.floor(calculatedDelay / 2);
            return half + Math.floor(Math.random() * half);

        default:
            return calculatedDelay;
    }
}
