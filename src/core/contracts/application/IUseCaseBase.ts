import { Result } from "@/core/domain/entities/Result";

/**
 * Interfaccia per il caso d'uso base.
 */
export interface IUseCaseBase<T> {
    /**
     * Esegue il caso d'uso con l'input fornito.
     * @returns Una promessa che risolve il risultato dell'operazione.
    */
    execute(input?: any): Promise<Result<T, Error>>
}