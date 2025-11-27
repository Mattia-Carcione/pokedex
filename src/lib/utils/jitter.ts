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
 * è il delay usato nel tentativo precedente.
 * @param jitter 'none' | 'full' | 'equal' | 'decorrelated'
 * è la casualità sui ritardi calcolati.
 * @param baseDelay number
 * è il ritardo in ms minimo.
 * @param maxDelay number
 * è il ritardo in ms massimo.
 * @returns 
 * ritorna il numero di casualità calcolato sul ritardo.
 */
export function applyJitter(calculatedDelay: number, prevDelay: number | undefined, jitter: 'none' | 'full' | 'equal' | 'decorrelated', baseDelay = 100, maxDelay = 10000): number {

    switch (jitter) {
        case 'decorrelated':
            const min = baseDelay;
            const max = Math.min(maxDelay, Math.max(calculatedDelay, prevDelay ?? calculatedDelay));
            const low = Math.floor(min);
            const high = Math.floor((prevDelay ? prevDelay * 3 : calculatedDelay));
            const candidate = Math.floor(Math.random() * (high - low + 1) + low);
            return Math.min(max, candidate);

        case 'full':
            /**
             * Ritardo = random(0, calculatedDelay)
             * — si sceglie uniformemente un valore fra 0 e il delay calcolato. 
             * Molto efficace per disperdere tentativi.
             */
            return Math.floor(Math.random() * calculatedDelay);

        case 'equal':
            /**
             * Proposto per bilanciare attesa media e spike: 
             * delay = calculatedDelay / 2 + random(0, calculatedDelay / 2)
             * — media = 75% del delay calcolato, meno variabilità estrema rispetto al full jitter.
             */
            const half = Math.floor(calculatedDelay / 2);
            return half + Math.floor(Math.random() * half);

        default:
            /**
             * Ritardo = valore calcolato. Deterministico.
             */
            return calculatedDelay;
    }
}
