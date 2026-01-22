import { ErrorTypeEnum } from "../enums/ErrorTypeEnum";

/**
 * Rappresenta un errore Axios normalizzato in una struttura coerente.
 */
export abstract class HttpError extends Error {
    constructor( 
        public readonly type: ErrorTypeEnum.HTTP | ErrorTypeEnum.NETWORK | ErrorTypeEnum.TIMEOUT | ErrorTypeEnum.UNKNOWN,
        public readonly status?: number,
        public readonly url?: string,
        message?: string,
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;     
    }
}