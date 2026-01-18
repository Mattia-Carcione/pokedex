import { RetryAxiosRequestConfig } from "@/shared/infrastructure/http/types/AxiosExtendedTypes";

/**
 * Configurazione default di RetryAxiosRequestConfig.
 * - retry: 3
 * - retryDelay: 1000
 * - jitter: full
 */
export const DEFAULT_OPTS: RetryAxiosRequestConfig = {
    retry: 3,
    retryDelay: 1000,
    jitter: "full"
}
