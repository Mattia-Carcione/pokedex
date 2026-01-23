import { EnvironmentEnum } from "@/app/EnvironmentEnum";

/**
 * Funzione utility per l'istanza delle classi in base all'ambiente.
 * @param env (EnvironmentEnum) - Variabile di ambiente.
 * @param prod (() => T) - Classe da istanziare in ambiente di produzione.
 * @param dev (() => T) - Classe da istanziare in ambiente di sviluppo.
 * @returns Ritorna l'istanza della classe in base alla variabile di ambiente passata in input
 */
export function createByEnvHelper<T>(env: EnvironmentEnum, prod: () => T, dev: () => T): T {
    switch (env) {
        case EnvironmentEnum.DEVELOPMENT:
            return dev();
        default:
            return prod();
    }
}
