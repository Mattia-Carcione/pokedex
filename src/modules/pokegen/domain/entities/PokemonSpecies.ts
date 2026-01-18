/**
 * Rappresenta il dettaglio di un Pokémon nel dominio dell'applicazione.
 * Estende la classe Pokemon aggiungendo ulteriori proprietà specifiche del dettaglio.
 * @property height (number) - l'altezza del pokémon
 */
export class PokemonSpecies {
    constructor (public readonly id: number, public readonly name: string) { }
}