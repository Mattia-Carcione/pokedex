/**
 * Interfaccia astratta per il logger.
 */
export interface ILogger {
    info(message: string, ...optionalParams: any[]): void;
    warn(message: string, ...optionalParams: any[]): void;
    error(message: string, ...optionalParams: any[]): void;
    debug(message: string, ...optionalParams: any[]): void;
    log(message: string, ...optionalParams: any[]): void;
}