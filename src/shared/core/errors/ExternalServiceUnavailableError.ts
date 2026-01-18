import { ApplicationError } from "./ApplicationError";

/**
 * Errore per servizio esterno non disponibile.
 */
export class ExternalServiceUnavailableError extends ApplicationError {
  readonly code = "EXTERNAL_SERVICE_UNAVAILABLE";

  constructor(message = "External service unavailable") {
    super(message);
  }
}
