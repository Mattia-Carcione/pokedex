/**
 * Enum che rappresenta i codici di stato HTTP rilevanti per il retry.
 */
export enum StatusCodeEnum {
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}
