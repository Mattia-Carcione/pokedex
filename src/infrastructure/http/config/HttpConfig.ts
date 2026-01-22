import { RetryEnum } from "../enums/RetryEnum";
import { RetryRequestConfig } from "../types/RequestConfig";

/**
 * Configurazione default di RetryRequestConfig.
 * - retry: 3
 * - retryDelay: 1000
 * - jitter: full
 */
export const DEFAULT_OPTS: RetryRequestConfig = {
    retry: 3,
    retryDelay: 1000,
    jitter: RetryEnum.FULL
}