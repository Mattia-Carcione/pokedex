/**
 * Rappresenta il risultato di un'operazione che può avere successo o fallire.
 * 
 * @template T - Tipo del dato restituito in caso di successo.
 * @template E - Tipo dell'errore restituito in caso di fallimento (default: string).
 */
export class Result<T, E = string> {
    constructor(
        public readonly success: boolean,
        public readonly data: T | null,
        public readonly error: E | null
    ) {}
} 