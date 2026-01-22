import { IHttpClient } from "@/core/contracts/infrastructure/http/IHttpClient";
import { AxiosInstance } from "axios";
import { HttpAxiosError } from "./errors/HttpAxiosError";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";


/**
 * Implementazione di IHttpClient utilizzando Axios.
 */
export class AxiosHttpClient implements IHttpClient {
    constructor(
        private readonly client: AxiosInstance,
        private readonly logger: ILogger,
    ) {}

    /**
     * Esegue una richiesta GET.
     * @param url - L'URL della risorsa da recuperare.
     * @returns Una Promise che risolve con i dati della risposta.
     */
    async get<T>(url: string): Promise<T> {
        try {
            const response = await this.client.get(url);
            this.logger.debug("[AxiosHttpClient] - Risposta della richiesta GET a " + url, response);
            return response.data;
        } catch (err) {
            this.logger.error("[AxiosHttpClient] - Errore nella richiesta GET a " + url + ": " + (err as Error).message);
            throw new HttpAxiosError(err);
        }
    }
}