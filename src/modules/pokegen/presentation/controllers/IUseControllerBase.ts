/**
 * Classe base per i controller che gestiscono le richieste della UI.
 */
export abstract class IUseControllerBase {
    /**
     * Gestisce la richiesta della UI.
     */
    abstract loadData(input?: string): Promise<void>;
}