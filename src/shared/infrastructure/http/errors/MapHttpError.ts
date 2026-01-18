import { ErrorType } from '@/shared/core/enums/ErrorType';
import { NormalizedHttpError } from './NormalizedHttpError';
import { NotFoundError } from '@/shared/core/errors/NotFoundError';
import { UnauthorizedError } from '@/shared/core/errors/UnauthorizedError';
import { ExternalServiceUnavailableError } from '@/shared/core/errors/ExternalServiceUnavailableError';


export function mapHttpError(err: NormalizedHttpError): never {
  if (err.type === ErrorType.HTTP) {
    if (err.status === 404) throw new NotFoundError();
    if (err.status === 401) throw new UnauthorizedError();
  }

  if (err.type === ErrorType.NETWORK || err.type === ErrorType.TIMEOUT) {
    throw new ExternalServiceUnavailableError();
  }

  throw new ExternalServiceUnavailableError("Errore inaspettato durante il recupero dei dati.");
}
