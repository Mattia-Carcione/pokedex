/**
 * Interfaccia per una factory di classi.
 */
export interface IClassFactory<T> {
    /**
     * Crea un'istanza della classe T con i parametri specificati.
     * @param args - Parametri da passare al costruttore della classe T.
     * @returns Un'istanza della classe T.
     */
    create(...args: any[]): T;
}