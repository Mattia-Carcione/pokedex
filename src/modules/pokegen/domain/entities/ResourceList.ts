import { NamedResource } from "../../../../shared/core/types/CommonTypes";

/**
 * Rappresenta una lista di risorse con il conteggio totale.
 */
export class ResourceList {
    constructor(
        public readonly count: number,
        public readonly results: NamedResource[]
    ) {}
}