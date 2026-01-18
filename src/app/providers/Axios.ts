import { AxiosHttpClient } from "@/shared/infrastructure/http/client/HttpClient";
import { CreateApiClient } from "@/shared/infrastructure/http/config/AxiosFactory";

/**
 * Istanza di Axios preconfigurata per interagire con la PokeAPI.
 * Include meccanismi di retry per migliorare l'affidabilità delle richieste.
 */
const axiosInstance = CreateApiClient('', {
  retry: 3,
  retryDelay: 1000,
  jitter: "full"
});

/**
 * Client HTTP basato su Axios per effettuare richieste alla PokeAPI.
 */
export const pokeApiClient = new AxiosHttpClient(axiosInstance);