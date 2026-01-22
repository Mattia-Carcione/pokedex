/**
 * Rappresenta un Pokémon nel dominio dell'applicazione.
 * @property id (number) - l'id del pokémon
 * @property name (string) - il nome del pokémon
 * @property types (string[]) - i tipi del pokémon
 * @property sprite (string) - il percorso dell'immagine del pokémon
 */
export class Pokemon {
    constructor (
        public readonly id: number,
        public readonly name: string,
        public readonly types: { slot: number; name: string; url: string; }[],
        public readonly sprite: string,
        public readonly height: number,
        public readonly weight: number,
        public readonly stats: { name: string; base: number }[],
    ) {};

    public genderRate?: number;
    public flavorText?: { version: string; text: string }[];
    public captureRate?: number;
    public generation?: string;
    public genus?: string;
    public evolutionUrl?: string;
    public varieties?: { is_default: boolean; pokemon: { name: string; url: string; }; }[];
}