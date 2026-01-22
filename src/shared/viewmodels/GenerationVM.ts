/**
 * ViewModel rappresentante una generazione di Pokémon.
 */
export interface GenerationVM {
    version: number;
    displayVersion: string;
    href: { name: string; params: { id: number } };
    label: string;
}