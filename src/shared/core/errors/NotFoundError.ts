import { ApplicationError } from "./ApplicationError";

/**
 * Errore per risorsa non trovata.
 */
export class NotFoundError extends ApplicationError {
  readonly code = "NOT_FOUND";

  constructor(message = "Resource not found") {
    super(message);
  }
}
