/**
 * Rappresenta un errore Axios normalizzato in una struttura coerente.
 */
export class NormalizedHttpError extends Error {
    constructor(
        public readonly type: "network" | "timeout" | "http" | "unknown",
        public readonly status?: number,
        public readonly url?: string,
        message?: string,
    ) {
        super(message);
    }
}