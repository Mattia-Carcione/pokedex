import { ApplicationError } from "./ApplicationError";

/**
 * Errore per accesso non autorizzato.
 * 
 * Usato quando un'operazione richiede credenziali valide o permessi specifici.
 */
export class UnauthorizedError extends ApplicationError {
  readonly code = "UNAUTHORIZED";

  constructor(message = "Unauthorized access") {
    super(message);
  }
}
